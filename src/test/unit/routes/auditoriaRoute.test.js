import supertest from "supertest";
import app from "../../../app.js";
import { describe, test, expect, beforeAll } from "@jest/globals";

describe("Testes da Rota de Auditoria (/auditoria/logs)", () => {
    const req = supertest(app);
    let adminToken;
    let operadorToken;

    beforeAll(async () => {
        const adminRes = await req.post("/auth/login").send({
            cpf: "000.000.000-00",
            senha: "Admin@123!"
        });
        adminToken = adminRes.body.data?.accessToken;

        const operadorRes = await req.post("/auth/login").send({
            email: "operador@viveiro.com",
            senha: "Admin@123"
        });
        operadorToken = operadorRes.body.data?.accessToken;
    });

    describe("GET /auditoria/logs - Permissões e Autenticação", () => {
        test("TC01 - Bloquear acesso sem token de autenticação", async () => {
            const res = await req.get("/auditoria/logs");

            expect(res.statusCode).toBe(498);
            expect(res.body).toHaveProperty("message");
        });

        test("TC02 - Bloquear acesso com usuário Operador (sem permissão)", async () => {
            if (!operadorToken) {
                console.warn("Token de operador não disponível, pulando teste");
                return;
            }

            const res = await req
                .get("/auditoria/logs")
                .set("Authorization", `Bearer ${operadorToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty("message");
        });

        test("TC03 - Permitir acesso com usuário Administrador", async () => {
            const res = await req
                .get("/auditoria/logs")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("docs");
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });
    });

    describe("GET /auditoria/logs - Paginação", () => {
        test("TC04 - Listar com paginação padrão", async () => {
            const res = await req
                .get("/auditoria/logs")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("page", 1);
            expect(res.body.data).toHaveProperty("limit");
            expect(res.body.data).toHaveProperty("totalDocs");
            expect(res.body.data).toHaveProperty("totalPages");
        });

        test("TC05 - Listar com página específica", async () => {
            const res = await req
                .get("/auditoria/logs?page=1&limit=5")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("page", 1);
            expect(res.body.data).toHaveProperty("limit", 5);
            expect(res.body.data.docs.length).toBeLessThanOrEqual(5);
        });

        test("TC06 - Limitar quantidade de itens por página", async () => {
            const res = await req
                .get("/auditoria/logs?limit=10")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.docs.length).toBeLessThanOrEqual(10);
        });
    });

    describe("GET /auditoria/logs - Filtros", () => {
        test("TC07 - Filtrar por ação específica", async () => {
            const res = await req
                .get("/auditoria/logs?acao=LOGIN")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);

            if (res.body.data.docs.length > 0) {
                res.body.data.docs.forEach(log => {
                    expect(log.acao).toContain("LOGIN");
                });
            }
        });

        test("TC08 - Filtrar por intervalo de datas", async () => {
            const dataInicio = new Date();
            dataInicio.setDate(dataInicio.getDate() - 30);
            
            const dataFim = new Date();

            const res = await req
                .get(`/auditoria/logs?dataInicio=${dataInicio.toISOString()}&dataFim=${dataFim.toISOString()}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });

        test("TC09 - Filtrar por usuário específico", async () => {

            const listRes = await req
                .get("/auditoria/logs?limit=1")
                .set("Authorization", `Bearer ${adminToken}`);

            if (listRes.body.data.docs.length === 0) {
                console.warn("Nenhum log encontrado para testar filtro de usuário");
                return;
            }

            const usuarioId = listRes.body.data.docs[0].usuario_id._id;

            const res = await req
                .get(`/auditoria/logs?usuarioId=${usuarioId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data.docs)).toBe(true);

            if (res.body.data.docs.length > 0) {
                res.body.data.docs.forEach(log => {
                    expect(log.usuario_id._id).toBe(usuarioId);
                });
            }
        });

        test("TC10 - Combinar múltiplos filtros", async () => {
            const dataInicio = new Date();
            dataInicio.setDate(dataInicio.getDate() - 7);

            const res = await req
                .get(`/auditoria/logs?acao=LOGIN&dataInicio=${dataInicio.toISOString()}&page=1&limit=20`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
            expect(res.body.data).toHaveProperty("page", 1);
        });
    });

    describe("GET /auditoria/logs - Estrutura de Resposta", () => {
        test("TC11 - Validar estrutura dos logs retornados", async () => {
            const res = await req
                .get("/auditoria/logs?limit=1")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            
            if (res.body.data.docs.length > 0) {
                const log = res.body.data.docs[0];
                
                expect(log).toHaveProperty("_id");
                expect(log).toHaveProperty("usuario_id");
                expect(log).toHaveProperty("acao");
                expect(log).toHaveProperty("data_registro");
                
                expect(typeof log._id).toBe("string");
                expect(typeof log.acao).toBe("string");
                expect(typeof log.data_registro).toBe("string");
            }
        });

        test("TC12 - Validar estrutura de paginação", async () => {
            const res = await req
                .get("/auditoria/logs")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
            expect(res.body.data).toHaveProperty("totalDocs");
            expect(res.body.data).toHaveProperty("limit");
            expect(res.body.data).toHaveProperty("page");
            expect(res.body.data).toHaveProperty("totalPages");
            expect(res.body.data).toHaveProperty("hasNextPage");
            expect(res.body.data).toHaveProperty("hasPrevPage");
        });
    });

    describe("GET /auditoria/logs - Casos Extremos", () => {
        test("TC13 - Listar com página fora do intervalo", async () => {
            const res = await req
                .get("/auditoria/logs?page=9999")
                .set("Authorization", `Bearer ${adminToken}`);

            expect([200, 400]).toContain(res.statusCode);
        });

        test("TC14 - Listar com limite máximo", async () => {
            const res = await req
                .get("/auditoria/logs?limit=100")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.docs.length).toBeLessThanOrEqual(100);
        });

        test("TC15 - Validar que logs estão em ordem cronológica (descendente)", async () => {
            const res = await req
                .get("/auditoria/logs?limit=10")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            
            if (res.body.data.docs.length > 1) {
                for (let i = 0; i < res.body.data.docs.length - 1; i++) {
                    const data1 = new Date(res.body.data.docs[i].data_registro);
                    const data2 = new Date(res.body.data.docs[i + 1].data_registro);
                    
                    expect(data1.getTime()).toBeGreaterThanOrEqual(data2.getTime());
                }
            }
        });
    });
});
