import supertest from "supertest";
import app from "../../../app.js";
import { describe, test, expect, beforeAll } from "@jest/globals";

describe("Testes da Rota de Relatórios (/relatorios)", () => {
    const req = supertest(app);
    let adminToken;

    beforeAll(async () => {
        const adminRes = await req.post("/auth/login").send({
            cpf: "000.000.000-00",
            senha: "Admin@123!"
        });
        adminToken = adminRes.body.data?.accessToken;
    });

    describe("GET /relatorios - Autenticação", () => {
        test("TC01 - Bloquear acesso sem token de autenticação", async () => {
            const res = await req.get("/relatorios/lotes");
            expect(res.statusCode).toBe(498);
        });
    });

    describe("GET /relatorios/lotes", () => {
        test("TC02 - Listar com autenticação", async () => {
            const res = await req
                .get("/relatorios/lotes")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
        });

        test("TC03 - Listar com paginação", async () => {
            const res = await req
                .get("/relatorios/lotes?page=1&limite=5")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });
    });

    describe("GET /relatorios/movimentacoes", () => {
        test("TC04 - Listar com autenticação", async () => {
            const res = await req
                .get("/relatorios/movimentacoes")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
        });

        test("TC05 - Listar com paginação", async () => {
            const res = await req
                .get("/relatorios/movimentacoes?page=1&limite=10")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });
    });

    describe("GET /relatorios/mortalidade", () => {
        test("TC06 - Listar com filtro de datas obrigatório", async () => {
            const dataInicio = new Date();
            dataInicio.setDate(dataInicio.getDate() - 30);
            const dataFim = new Date();

            const res = await req
                .get(`/relatorios/mortalidade?data_inicio=${dataInicio.toISOString()}&data_fim=${dataFim.toISOString()}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
        });

        test("TC07 - Bloquear sem filtro de datas", async () => {
            const res = await req
                .get("/relatorios/mortalidade")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(500);
        });
    });

    describe("GET /relatorios/especies", () => {
        test("TC08 - Listar com autenticação", async () => {
            const res = await req
                .get("/relatorios/especies")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
        });

        test("TC09 - Listar com paginação", async () => {
            const res = await req
                .get("/relatorios/especies?page=1&limite=10")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });
    });

    describe("GET /relatorios/estufas", () => {
        test("TC10 - Listar com autenticação", async () => {
            const res = await req
                .get("/relatorios/estufas")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
        });

        test("TC11 - Listar com paginação", async () => {
            const res = await req
                .get("/relatorios/estufas?page=1&limite=10")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });
    });

    describe("GET /relatorios/usuarios", () => {
        test("TC12 - Listar com autenticação", async () => {
            const res = await req
                .get("/relatorios/usuarios")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
        });

        test("TC13 - Listar com paginação", async () => {
            const res = await req
                .get("/relatorios/usuarios?page=1&limite=10")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });
    });

    describe("GET /relatorios/destinatarios", () => {
        test("TC14 - Listar com autenticação", async () => {
            const res = await req
                .get("/relatorios/destinatarios")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
        });

        test("TC15 - Listar com paginação", async () => {
            const res = await req
                .get("/relatorios/destinatarios?page=1&limite=10")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });
    });

    describe("GET /relatorios/auditoria", () => {
        test("TC16 - Listar com autenticação", async () => {
            const res = await req
                .get("/relatorios/auditoria")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
        });

        test("TC17 - Listar com paginação", async () => {
            const res = await req
                .get("/relatorios/auditoria?page=1&limite=10")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });
    });
});
