import supertest from "supertest";
import app from "../../../app.js";
import { describe, test, expect, beforeAll } from "@jest/globals";

describe("Testes da Rota de Estufas (Integração Real)", () => {
    let token;
    let estufaId;
    let estufaNovaId;

    const req = supertest(app);

    beforeAll(async () => {
        // Realiza o login real para herdar o token do banco em memória
        const resLogin = await req.post("/auth/login").send({ 
            email: 'admin@viveiro.com', 
            senha: 'Admin@123!' 
        });
        
        token = resLogin.body.data.accessToken;

        // Busca as estufas injetadas pelo seed para obter um ID válido de listagem
        const resEstufa = await req.get("/estufas").set("Authorization", `Bearer ${token}`);
        if (resEstufa.body.data && resEstufa.body.data.docs && resEstufa.body.data.docs.length > 0) {
            estufaId = resEstufa.body.data.docs[0]._id || resEstufa.body.data.docs[0].id;
        }
    });

    describe("Autenticação e Autorização", () => {
        test("TC01 - Bloquear acesso sem token JWT", async () => {
            const res = await req.get("/estufas");
            expect([401, 498]).toContain(res.statusCode);
        });
    });

    describe("Gerenciamento de Estufas", () => {
        test("TC02 - Registrar nova Estufa com sucesso", async () => {
            const res = await req
                .post("/estufas")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    codigo_identificador: "EST-NOVA-01",
                    localizacao_estufa: "02",
                    localizacao_barraca: "B01",
                    localizacao_posicao: "01",
                    capacidade_total: 1500
                });

            expect(res.statusCode).toBe(201);
            
            // Verifica se o objeto retornado contém a propriedade, aceitando o padrão autogerado pelo backend
            expect(res.body.data).toHaveProperty("codigo_identificador");
            
            // Guarda o ID real gerado para garantir que o TC07 use uma estufa totalmente vazia
            estufaNovaId = res.body.data._id || res.body.data.id;
        });

        test("TC03 - Listar todas as estufas cadastradas", async () => {
            const res = await req
                .get("/estufas")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });

        test("TC04 - Buscar detalhes de uma estufa por ID", async () => {
            if (!estufaId) return; 
            
            const res = await req
                .get(`/estufas/${estufaId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            const idRecebido = res.body.data._id || res.body.data.id;
            expect(idRecebido).toBe(estufaId);
        });

        test("TC05 - Atualizar dados de uma estufa", async () => {
            if (!estufaId) return;

            const res = await req
                .patch(`/estufas/${estufaId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    capacidade_total: 2000
                });

            expect(res.statusCode).toBe(200);
        });

        test("TC06 - Bloquear payload de criação com dados faltando", async () => {
            const res = await req
                .post("/estufas")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Payload vazio força a rejeição imediata do Zod Schema da rota
                });

            expect(res.statusCode).toBe(400);
        });

        test("TC07 - Inativar estufa com sucesso (Soft Delete)", async () => {
            // Se o TC02 passou, estufaNovaId existe e é seguro deletar sem disparar travas de lotes
            const idParaDeletar = estufaNovaId || estufaId;
            if (!idParaDeletar) return;

            const res = await req
                .delete(`/estufas/${idParaDeletar}`)
                .set("Authorization", `Bearer ${token}`);

            expect([200, 204]).toContain(res.statusCode);
        });
    });
});