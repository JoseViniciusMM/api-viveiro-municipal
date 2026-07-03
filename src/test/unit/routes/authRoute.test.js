import supertest from "supertest";
import app from "../../../app.js";
import { describe, test, expect } from "@jest/globals";

describe("Testes da Rota de Autenticação (Auth)", () => {
    let accessToken;
    let refreshToken;

    const req = supertest(app);

    describe("Login (/auth/login)", () => {
        test("TC01 - Realizar login com credenciais válidas", async () => {
            const res = await req.post("/auth/login").send({
                email: "teste@viveiro.com",
                senha: "Admin@123!"
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("accessToken");
            expect(res.body.data).toHaveProperty("refreshToken");

            accessToken = res.body.data.accessToken;
            refreshToken = res.body.data.refreshToken;
        });

        test("TC02 - Bloquear login com credenciais inválidas", async () => {
            const res = await req.post("/auth/login").send({
                email: "teste@viveiro.com",
                senha: "SenhaErrada123!"
            });

            expect(res.statusCode).toBeGreaterThanOrEqual(400); // 400 ou 401
            expect(res.body).toHaveProperty("message");
        });

        test("TC03 - Bloquear login sem senha", async () => {
            const res = await req.post("/auth/login").send({
                email: "teste@viveiro.com"
            });

            expect(res.statusCode).toBe(400);
        });
    });

    describe("Refresh Token (/auth/refresh-token)", () => {
        test("TC06 - Renovar token de acesso usando refresh token válido", async () => {
            const res = await req.post("/auth/refresh-token").send({
                refreshToken: refreshToken
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("accessToken");
            expect(res.body.data).toHaveProperty("expiraEm");
        });

        test("TC07 - Bloquear renovação com refresh token inválido ou ausente", async () => {
            const res = await req.post("/auth/refresh-token").send({
                refreshToken: "token-falso-manipulado-123456"
            });

            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });
    });

    describe("Recuperação de Senha (/auth/esqueceu-senha)", () => {
        test("TC08 - Solicitar redefinição de senha com email válido", async () => {
            const res = await req.post("/auth/esqueceu-senha").send({
                email: "teste@viveiro.com"
            });

            expect(res.statusCode).toBe(200);
        });
    });

    describe("Logout (/auth/logout)", () => {
        test("TC05 - Bloquear logout sem token de acesso", async () => {
            const res = await req.post("/auth/logout");
            expect([401, 498]).toContain(res.statusCode);
        });

        test("TC04 - Realizar logout com token válido", async () => {
            const res = await req
                .post("/auth/logout")
                .set("Authorization", `Bearer ${accessToken}`);

            expect([200, 204]).toContain(res.statusCode);
        });
    });
});