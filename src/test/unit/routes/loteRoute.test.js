import supertest from "supertest";
import app from "../../../app.js";
import { describe, test, expect, beforeAll } from "@jest/globals";
import { FASE_LOTE } from "../../../constants/lote.js";
import { STATUS_ESTUFA } from "../../../constants/estufa.js";

describe("Testes da Rota de Lotes", () => {
    let token;
    let especieId;
    let estufaPrincipalId;
    let estufaSecundariaId;
    let estufaTerciariaId;
    let loteId;

    const req = supertest(app);

    beforeAll(async () => {

        const resLogin = await req.post("/auth/login").send({ 
            email: 'admin@viveiro.com', 
            senha: 'Admin@123!' 
        });
        token = resLogin.body.data.accessToken;

        const resEspecie = await req.get("/especies").set("Authorization", `Bearer ${token}`);
        especieId = resEspecie.body.data.docs[0]._id || resEspecie.body.data.docs[0].id;

        const resEstufas = await req.get("/estufas").set("Authorization", `Bearer ${token}`);
        const estufasLivres = resEstufas.body.data.docs.filter(
            e => e.status.toUpperCase() === STATUS_ESTUFA.Livre.toUpperCase()
        );
        
        estufaPrincipalId = estufasLivres[0]._id || estufasLivres[0].id;
        estufaSecundariaId = estufasLivres[1]._id || estufasLivres[1].id;
        estufaTerciariaId = estufasLivres[2]._id || estufasLivres[2].id;
    });

    describe("Autenticação e Autorização", () => {
        test("TC01 - Bloquear acesso sem token JWT", async () => {
            const res = await req.get("/lotes");
            expect([401, 498]).toContain(res.statusCode);
        });
    });

    describe("Abertura de Lotes e Controle de Espaço Físico/Estoque", () => {
        test("TC02 - Registrar novo Lote com sucesso", async () => {
            const res = await req
                .post("/lotes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itens_especies: [{
                        especie_id: especieId,
                        quantidade_inicial: 50
                    }],
                    estufa_id: estufaPrincipalId
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty("codigo");
            expect(res.body.data.estufa_id).toBe(estufaPrincipalId);

            loteId = res.body.data._id || res.body.data.id;
        });

        test("TC03 - Bloquear Lote se quantidade for maior que a Sementeira", async () => {
            const res = await req
                .post("/lotes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itens_especies: [{
                        especie_id: especieId,
                        quantidade_inicial: 99999
                    }],
                    estufa_id: estufaPrincipalId
                });

            expect(res.statusCode).toBe(400);
        });

        test("Preparação Isolada - Reduzir capacidade da Estufa Secundária", async () => {
            await req.patch(`/estufas/${estufaSecundariaId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ capacidade_total: 10 });
        });

        test("TC04 - Bloquear Lote se exceder capacidade da Estufa", async () => {
            const res = await req
                .post("/lotes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itens_especies: [{
                        especie_id: especieId,
                        quantidade_inicial: 50
                    }],
                    estufa_id: estufaSecundariaId
                });

            expect(res.statusCode).toBe(400);
        });

        test("TC05 - Bloquear Lote em Estufa em Manutenção/Indisponível", async () => {
            const patchRes = await req.patch(`/estufas/${estufaTerciariaId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ status: STATUS_ESTUFA.Manutencao, capacidade_total: 1 });
                
            expect(patchRes.statusCode).toBe(200);

            const res = await req
                .post("/lotes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itens_especies: [{ especie_id: especieId, quantidade_inicial: 5 }],
                    estufa_id: estufaTerciariaId
                });

            expect(res.statusCode).toBe(400);
        });

        test("TC06 - Bloquear payload de criação com dados faltando", async () => {
            const res = await req
                .post("/lotes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    itens_especies: [{ especie_id: especieId, quantidade_inicial: 50 }]
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe("Manejo, Evolução Biológica e Transferência", () => {
        test("TC07 - Atualizar fase biológica do lote (ex: Produção)", async () => {
            const res = await req
                .patch(`/lotes/${loteId}/fase`)
                .set("Authorization", `Bearer ${token}`)
                .send({ fase: FASE_LOTE.Producao });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.fase.toUpperCase()).toBe(FASE_LOTE.Producao.toUpperCase());
        });

        test("TC09 - Registrar Mortalidade no Lote", async () => {
            const res = await req
                .post(`/lotes/${loteId}/mortalidade`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    quantidade: 5,
                    justificativa: "Mudas morreram por conta de fungos."
                });

            expect(res.statusCode).toBe(201);
        });

        test("TC10 - Bloquear Mortalidade superior ao saldo do lote", async () => {
            const res = await req
                .post(`/lotes/${loteId}/mortalidade`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    quantidade: 999,
                    justificativa: "Mortalidade excessiva"
                });

            expect(res.statusCode).toBe(400);
        });

        test("TC12 - Bloquear transferência para Estufa sem espaço", async () => {
            const res = await req
                .patch(`/lotes/${loteId}/transferir`)
                .set("Authorization", `Bearer ${token}`)
                .send({ nova_estufa_id: estufaSecundariaId });

            expect(res.statusCode).toBe(400);
        });

        test("Preparação Isolada - Restaurar Estufa Secundária", async () => {
            await req.patch(`/estufas/${estufaSecundariaId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ capacidade_total: 1000, status: STATUS_ESTUFA.Livre });
        });

        test("TC11 - Transferir Lote para nova Estufa com espaço", async () => {
            const res = await req
                .patch(`/lotes/${loteId}/transferir`)
                .set("Authorization", `Bearer ${token}`)
                .send({ nova_estufa_id: estufaSecundariaId });

            expect(res.statusCode).toBe(200);
            const idRecebido = res.body.data.estufa_id._id || res.body.data.estufa_id.id || res.body.data.estufa_id;
            expect(idRecebido).toBe(estufaSecundariaId);
        });

        test("TC08 - Alterar lote para Finalizado libera a Estufa", async () => {
            const res = await req
                .patch(`/lotes/${loteId}/fase`)
                .set("Authorization", `Bearer ${token}`)
                .send({ fase: FASE_LOTE.Finalizado });

            expect(res.statusCode).toBe(200);

            const resEstufa = await req.get(`/estufas/${estufaSecundariaId}`).set("Authorization", `Bearer ${token}`);
            expect(resEstufa.body.data.status.toUpperCase()).toBe(STATUS_ESTUFA.Livre.toUpperCase());
        });
    });

    describe("Listagens, Detalhes e Rastreabilidade", () => {
        test("TC14 - Listar lotes com paginação padrão", async () => {
            const res = await req.get("/lotes").set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
        });

        test("TC15 - Listar lotes utilizando filtro de fase", async () => {
            const res = await req.get(`/lotes?fase=Finalizado`).set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            const apenasFinalizados = res.body.data.docs.every(l => l.fase.toUpperCase() === FASE_LOTE.Finalizado.toUpperCase());
            expect(apenasFinalizados).toBe(true);
        });

        test("TC16 e TC17 - Visualizar por ID e retornar 404", async () => {
            const resOk = await req.get(`/lotes/${loteId}`).set("Authorization", `Bearer ${token}`);
            expect(resOk.statusCode).toBe(200);

            const resErr = await req.get(`/lotes/60b8d295f1d2b34567890123`).set("Authorization", `Bearer ${token}`);
            expect(resErr.statusCode).toBe(404);
        });

        test("TC18 - Buscar histórico/linha do tempo biológica do lote", async () => {
            const res = await req.get(`/lotes/${loteId}/historico`).set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("movimentacoes");
            expect(res.body.data).toHaveProperty("auditoria");
        });
    });
});