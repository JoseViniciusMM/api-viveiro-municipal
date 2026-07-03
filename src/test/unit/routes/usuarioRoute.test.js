import supertest from "supertest";
import app from "../../../app.js";
import { describe, it, expect } from "@jest/globals";
import faker from "faker-br";

describe("Testes da Rota de Usuários", () => {
    
    let token;
    let usuarioId;
    const req = supertest(app);

    test("Deve realizar login e obter token", async () => {

        const res = await req
        .post("/auth/login")
        .send({
            cpf: '000.000.000-00',
            senha: 'Admin@123!'});
        
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
    token = res.body.data.accessToken;
    });

    test("Deve acusar erro ao listar sem autenticação", async () => {

        const res = await req
        .get("/usuarios");
        expect(res.statusCode).toBe(498);
    });

    test("deve listar como administrador", async () => {

        const res = await req
        .get("/usuarios")
        .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("docs");
        expect(Array.isArray(res.body.data.docs)).toBe(true);
    });

    test("deve criar um novo usuário", async () => {

        const res = await req
        .post("/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
            nome: "joao silta",
            cpf: "123.456.789-00",
            email: "gabrielghnc@gmail.com",
            cargo: "OPERADOR"
        });
        expect (res.statusCode).toBe(201);
        expect (res.body.data).toHaveProperty("_id");
        usuarioId = res.body.data._id;
    })

    test("buscar usuario por id", async () => {

        const res = await req
        .get(`/usuarios/${usuarioId}`)
        .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("_id", usuarioId);
    });

    test("deve atualizar um usuário", async () => {

        const res = await req
        .patch(`/usuarios/${usuarioId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            nome: "joao silva atualizado",
            cargo: "ADMINISTRADOR"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("nome", "joao silva atualizado");
        expect(res.body.data).toHaveProperty("cargo", "ADMINISTRADOR");
    });
    
    test("deve atualizar o proprio perfil", async () => {

        const res = await req
        .patch(`/usuarios/perfil`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            nome: "joao silva administrador",
            cargo: "OPERADOR"
        })
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("nome", "joao silva administrador");
        expect(res.body.data).not.toHaveProperty("cargo", "OPERADOR");
    })


    test("deve fazer soft delete de um usuário", async () => {

        const rest = await req
        .delete(`/usuarios/${usuarioId}`)
        .set("Authorization", `Bearer ${token}`)
        expect(rest.statusCode).toBe(204);
    })

    test("Deve retornar 400 se tentar confirmar cadastro sem passar token nenhum", async () => {
            const res = await req
                .post("/usuarios/confirmar-cadastro")
                .send({ senha: "NovaSenha123!" });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toContain("Erro de validação");
        });
    });
    

