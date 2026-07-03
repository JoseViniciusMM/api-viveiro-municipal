import supertest from "supertest";
import app from "../../../app.js";
import { describe, test, expect, beforeAll } from "@jest/globals";
import { TIPO_MOVIMENTACAO } from "../../../constants/movimentacao.js";
import { FASE_LOTE } from "../../../constants/lote.js";

describe("Testes da Rota de Movimentações", () => {
    let token;
    let usuarioId;
    let especieId;
    let movimentacaoId;
    let loteId;
    let loteEspecieId;
    let destinatarioId;

    const req = supertest(app);

    beforeAll(async () => {

        const resLogin = await req.post("/auth/login").send({ 
            email: 'admin@viveiro.com', 
            senha: 'Admin@123!' 
        });
        
        token = resLogin.body.data.accessToken;
        usuarioId = resLogin.body.data.usuario.id || resLogin.body.data.usuario._id;

        const resEspecie = await req.get("/especies").set("Authorization", `Bearer ${token}`);
        especieId = resEspecie.body.data.docs[0]._id || resEspecie.body.data.docs[0].id;

        const resLote = await req.get("/lotes").set("Authorization", `Bearer ${token}`);
        loteId = resLote.body.data.docs[0]._id || resLote.body.data.docs[0].id;

        const resLoteDetalhe = await req.get(`/lotes/${loteId}`).set("Authorization", `Bearer ${token}`);
        const detalhe = resLoteDetalhe.body.data;

        if (detalhe.itens_especies && detalhe.itens_especies.length > 0) {
            const esp = detalhe.itens_especies[0].especie_id;
            loteEspecieId = esp._id || esp.id || esp;
        } else if (detalhe.especie_id) {
            loteEspecieId = detalhe.especie_id._id || detalhe.especie_id.id || detalhe.especie_id;
        }

        await req.patch(`/lotes/${loteId}/fase`)
            .set("Authorization", `Bearer ${token}`)
            .send({ fase: (FASE_LOTE && (FASE_LOTE.Pronto || FASE_LOTE.PRONTO)) ? (FASE_LOTE.Pronto || FASE_LOTE.PRONTO) : "PRONTO" });

        const resDest = await req.get("/destinatarios").set("Authorization", `Bearer ${token}`);
        destinatarioId = resDest.body.data.docs[0]._id || resDest.body.data.docs[0].id;
    });

    describe("Autenticação e Autorização", () => {
        test("TC01 - Bloquear acesso sem token JWT", async () => {
            const res = await req.get("/movimentacoes");
            expect([401, 498]).toContain(res.statusCode);
        });
    });

    describe("Criação de Movimentações e Regras de Saldo", () => {
        test("TC02 - Registrar Entrada manual", async () => {
            const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    tipo: TIPO_MOVIMENTACAO.Entrada,
                    quantidade: 500,
                    justificativa: "Entrada de sementes para bateria de testes API"
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty("quantidade", 500);
            
            movimentacaoId = res.body.data._id || res.body.data.id;
        });

        test("TC03 - Registrar Saída manual", async () => {
            const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    tipo: TIPO_MOVIMENTACAO.Saida,
                    quantidade: 50,
                    justificativa: "Saída técnica de teste"
                });

            expect(res.statusCode).toBe(201);
        });

        test("TC04 - Bloquear Saída que resulte em saldo negativo", async () => {
            const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    tipo: TIPO_MOVIMENTACAO.Saida,
                    quantidade: 9999999,
                    justificativa: "Teste de estouro de limite de estoque"
                });

            expect(res.statusCode).toBe(400);
        });

        test("TC05 - Registrar Ajuste positivo ou negativo", async () => {
            const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    tipo: TIPO_MOVIMENTACAO.Ajuste,
                    quantidade: 5,
                    justificativa: "Correção de prateleira"
                });

            expect(res.statusCode).toBe(201);
        });

        test("TC06 - Bloquear payload com dados obrigatórios faltando", async () => {
            const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    tipo: TIPO_MOVIMENTACAO.Entrada,
                });

            expect(res.statusCode).toBe(400);
        });

        test("TC07 - Registrar Mortalidade/Perda SEM informar lote_id", async () => {
            const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    tipo: TIPO_MOVIMENTACAO.Mortalidade,
                    quantidade: 2,
                    justificativa: "Muda seca"
                });

            expect(res.statusCode).toBe(400);
        });

        test("TC08 - Registrar Mortalidade/Perda COM lote_id válido", async () => {
            const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: loteEspecieId,
                    lote_id: loteId,
                    tipo: TIPO_MOVIMENTACAO.Mortalidade,
                    quantidade: 1,
                    justificativa: "Praga pontual identificada e isolada no lote"
                });

            expect(res.statusCode).toBe(201);
        });

        test("TC09 - Registrar Expedição sem destinatario_id", async () => {
            const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: loteEspecieId,
                    lote_id: loteId,
                    tipo: TIPO_MOVIMENTACAO.Expedicao,
                    quantidade: 10,
                    justificativa: "Entrega sem prefeitura informada"
                });

            expect(res.statusCode).toBe(400);
        });

        test("TC10 - Registrar Expedição com destinatario_id válido", async () => {
            const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: loteEspecieId,
                    lote_id: loteId,
                    destinatario_id: destinatarioId,
                    tipo: TIPO_MOVIMENTACAO.Expedicao,
                    quantidade: 5,
                    justificativa: "Expedição bem-sucedida"
                });

            expect(res.statusCode).toBe(201);
        });
    });

    describe("Estornos", () => {
        let movimentacaoParaEstornar;
        let movimentacaoGiganteId;

        test("Preparação Isolada - Criar Movimentação para Estornar", async () => {
             const res = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    tipo: TIPO_MOVIMENTACAO.Entrada,
                    quantidade: 10,
                    justificativa: "Entrada provisória para ser revertida"
                });
             movimentacaoParaEstornar = res.body.data._id || res.body.data.id;

             const resGigante = await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    tipo: TIPO_MOVIMENTACAO.Entrada,
                    quantidade: 99999,
                    justificativa: "Entrada gigante para teste de estorno"
                });
             movimentacaoGiganteId = resGigante.body.data._id || resGigante.body.data.id;

             await req
                .post("/movimentacoes")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    especie_id: especieId,
                    tipo: TIPO_MOVIMENTACAO.Saida,
                    quantidade: 99999,
                    justificativa: "Saída para zerar o saldo gerado pela entrada gigante"
                });
        });

        test("TC11 - Estornar uma movimentação de Entrada com sucesso", async () => {
            const res = await req
                .post(`/movimentacoes/${movimentacaoParaEstornar}/estorno`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    justificativa: "Foi digitado o valor errado na nota"
                });

            expect(res.statusCode).toBe(201);
        });

        test("TC12 - Bloquear estorno que cause saldo negativo", async () => {
            const res = await req
                .post(`/movimentacoes/${movimentacaoGiganteId}/estorno`)
                .set("Authorization", `Bearer ${token}`)
                .send({ justificativa: "Tentando estornar uma entrada que já foi consumida pela saída" });
            
            expect(res.statusCode).toBe(400);
        });
    });

    describe("Listagens, Filtros e Paginação", () => {
        test("TC14 - Listar movimentações com paginação padrão", async () => {
            const res = await req
                .get("/movimentacoes")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
            expect(res.body.data).toHaveProperty("totalDocs");
            expect(res.body.data).toHaveProperty("page");
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });

        test("TC15 - Listar movimentações utilizando filtro de tipo", async () => {
            const res = await req
                .get(`/movimentacoes?tipo=${TIPO_MOVIMENTACAO.Entrada}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            const apenasEntradas = res.body.data.docs.every(mov => mov.tipo.toUpperCase() === "ENTRADA");
            expect(apenasEntradas).toBe(true);
        });

        test("TC16 - Visualizar os detalhes de uma movimentação por ID", async () => {
            const res = await req
                .get(`/movimentacoes/${movimentacaoId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            const idRecebido = res.body.data._id || res.body.data.id;
            expect(idRecebido).toBe(movimentacaoId);
        });

        test("TC17 - Retornar 404 ao buscar movimentação inexistente", async () => {
            const res = await req
                .get("/movimentacoes/60b8d295f1d2b34567890123")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
        });

        test("TC18 - Listar histórico vinculado a uma única espécie", async () => {
            const res = await req
                .get(`/movimentacoes/especie/${especieId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });

        test("TC19 - Listar histórico vinculado a um único lote", async () => {
            const res = await req
                .get(`/movimentacoes/lote/${loteId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });
    });
});
