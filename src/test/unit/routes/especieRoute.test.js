import supertest from "supertest";
import app from "../../../app.js";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import faker from "faker-br";
import mongoose from "mongoose";
import { STATUS_ESPECIE, TIPO_ESPECIE, CATEGORIA_ESPECIE } from "../../../constants/especie.js";


describe("Testes da Rota de Espécie", () => {    
    let tokenAdmin;
    let especieIdTeste;
    const req = supertest(app);

    beforeAll(async () => {
        const resLogin = await req.post("/auth/login").send({
            email: 'admin@viveiro.com', 
            senha: 'Admin@123!'
        });
        tokenAdmin = resLogin.body.data?.accessToken;

        if (!tokenAdmin) {
            throw new Error("Falha ao obter token de autenticação para os testes.");
        }
    });


    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe("Cadastro e Validação de Espécies", () => {
        it("TC01 - Criar nova espécie válida", async () => {
            const res = await req
                .post("/especies")
                .set("Authorization", `Bearer ${tokenAdmin}`)
                .send({
                    nome_popular: "Ipê Amarelo",
                    variedade: "Nativa",
                    categoria: CATEGORIA_ESPECIE.Nativa,
                    tipo: TIPO_ESPECIE.Semente,
                    quantidade_inicial: 100
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.data).toHaveProperty("_id");
            expect(res.body.data.quantidade_atual).toEqual(0);
            expect(res.body.data.status).toEqual(STATUS_ESPECIE.Ativo);

            especieIdTeste = res.body.data._id;
        });

        it("TC02 - Campos obrigatórios ausentes", async () => {
            const res = await req
                .post("/especies")
                .set("Authorization", `Bearer ${tokenAdmin}`)
                .send({
                    categoria: CATEGORIA_ESPECIE.Frutifera,
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("errors");
        });

        it("TC03 - Sem autenticação", async () => {
            const res = await req
                .post("/especies")
                .send({
                    nome_popular: "Ipê Amarelo"
                });

            expect([401, 498]).toContain(res.statusCode);
        });
    });

    describe("Listagem e Filtros da Sementeira", () => { 
        it("TC04 - Listagem de espécies", async () => {
            const res = await req
                .get("/especies")
                .set("Authorization", `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
            expect(res.body.data).toHaveProperty("totalDocs");
        });

        it("TC05 - Filtrar por categoria", async () => {
            const res = await req
                .get(`/especies?categoria=${CATEGORIA_ESPECIE.Nativa}`)
                .set("Authorization", `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toBe(200);
            res.body.data.docs.forEach(esp => expect(esp.categoria).toBe(CATEGORIA_ESPECIE.Nativa));
        });

        it("TC06 - Filtro por tipo", async () => {
            const res = await req
                .get(`/especies?tipo=${TIPO_ESPECIE.Semente}`)
                .set("Authorization", `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toBe(200);
            res.body.data.docs.forEach(esp => expect(esp.tipo).toBe(TIPO_ESPECIE.Semente));
        });

        it("TC07 - Sem autenticação", async () => {
            const res = await req.get("/especies");
            expect([401, 498]).toContain(res.statusCode);
        });
    });

    describe("Consulta e Detalhamento de Espécie", () => {
        it("TC08 - Busca por ID válido", async () => {
            const res = await req
                .get(`/especies/${especieIdTeste}`)
                .set("Authorization", `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data._id).toBe(especieIdTeste);
        });

        it("TC09 - ID inválido", async () => {
            const idFake = new mongoose.Types.ObjectId().toString();
            const res = await req
                .get(`/especies/${idFake}`)
                .set("Authorization", `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toBe(404);
        });

        it("TC10 - ID com formato inválido", async () => {
            const res = await req
                .get("/especies/123-formato-invalido")
                .set("Authorization", `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toBe(400);
        });

        it("TC11 - Sem autenticação", async () => {
            const res = await req.get(`/especies/${especieIdTeste}`);
            expect([401, 498]).toContain(res.statusCode);
        });
    });

    describe("Atualização e Blindagem de Estoque", () => { 
        it("TC12 - Atualização de espécie válida", async () => {
            const res = await req
                .patch(`/especies/${especieIdTeste}`)
                .set("Authorization", `Bearer ${tokenAdmin}`)
                .send({
                    nome_popular: "Ipê Roxo"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.nome_popular).toBe("Ipê Roxo");
            expect(res.body.data).toHaveProperty("data_att");
        });

        it("TC13 - Blindagem de quantidade", async () => {
            const res = await req
                .patch(`/especies/${especieIdTeste}`)
                .set("Authorization", `Bearer ${tokenAdmin}`)
                .send({
                    quantidade_atual: 500
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.data.quantidade_atual).not.toBe(500);
        });

        it("TC14 - Blindagem de tipo", async () => {
            const res = await req
                .patch(`/especies/${especieIdTeste}`)
                .set("Authorization", `Bearer ${tokenAdmin}`)
                .send({
                    tipo: TIPO_ESPECIE.Muda
                });
                
            expect(res.statusCode).toBe(200);
            expect(res.body.data.tipo).toBe(TIPO_ESPECIE.Semente);
        });

        it("TC15 - ID inválido", async () => {
            const idFake = new mongoose.Types.ObjectId().toString();
            const res = await req
                .patch(`/especies/${idFake}`)
                .set("Authorization", `Bearer ${tokenAdmin}`)
                .send({
                    nome_popular: "Teste"
                });

            expect(res.statusCode).toBe(404);
        });

        it("TC16 - Sem autenticação", async () => {
            const res = await req
                .patch(`/especies/${especieIdTeste}`)
                .send({
                    nome_popular: "Teste"
                });
            
            expect([401, 498]).toContain(res.statusCode);
        });
    });

    describe("Histórico e Rastreabilidade da Espécie", () => {
        it("TC17 - Histórico de espécie válida", async () => {
            const res = await req
                .get(`/especies/${especieIdTeste}/historico`)
                .set("Authorization", `Bearer ${tokenAdmin}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
            expect(res.body.data).toHaveProperty("totalDocs");
        });

        it("TC18 - Espécie inexistente", async () => {
            const idFake = new mongoose.Types.ObjectId().toString();
            const res = await req
                .get(`/especies/${idFake}/historico`)
                .set("Authorization", `Bearer ${tokenAdmin}`);
            
            expect(res.statusCode).toBe(404);
        });

        it("TC19 - Sem autenticação", async () => {
            const res = await req.get(`/especies/${especieIdTeste}/historico`);
            expect([401, 498]).toContain(res.statusCode);
        });
    });
});
