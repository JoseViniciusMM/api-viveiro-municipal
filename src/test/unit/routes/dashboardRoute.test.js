import supertest from "supertest";
import app from "../../../app.js";
import { describe, it, expect } from "@jest/globals";

describe("Testes da Rota de Dashboard", () => {

    let token;
    const req = supertest(app);

    test("Deve acusar erro ao listar sem autenticação", async () => {

        const res = await req
        .get("/dashboard/geral");
        expect(res.statusCode).toBe(498);
    });

    test("Deve listar o dashboard geral com autenticação(ADMINISTRADOR)", async () => {

        const resLogin = await req
        .post("/auth/login")
        .send({
            cpf: '000.000.000-00',
            senha: 'Admin@123!'});

        token = resLogin.body.data.accessToken;

        const res = await req
        .get("/dashboard/geral")
        .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });

    test("Deve listar o dashboard geral com autenticação(USUARIO NORMAL)", async () => {

        const resLogin = await req
        .post("/auth/login")
        .send({
            cpf: '111.111.111-11',
            senha: 'Admin@123!'});

        token = resLogin.body.data.accessToken;

        const res = await req
        .get("/dashboard/geral")
        .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);})
})