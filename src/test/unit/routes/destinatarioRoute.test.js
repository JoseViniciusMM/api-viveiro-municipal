import supertest from "supertest";
import app from "../../../app.js";
import { describe, test, expect, beforeAll } from "@jest/globals";

describe("Testes da Rota de Destinatários (Integração Real)", () => {
    let token;
    let destinatarioId;
    let destinatarioNovoId;

    const req = supertest(app);

    beforeAll(async () => {
        // Realiza o login real para herdar o token do banco em memória
        const resLogin = await req.post("/auth/login").send({ 
            email: 'admin@viveiro.com', 
            senha: 'Admin@123!' 
        });
        
        token = resLogin.body.data.accessToken;

        // Busca os destinatários injetados pelo seed para obter um ID válido para os testes de leitura/edição
        const resDest = await req.get("/destinatarios").set("Authorization", `Bearer ${token}`);
        if (resDest.body.data && resDest.body.data.docs && resDest.body.data.docs.length > 0) {
            destinatarioId = resDest.body.data.docs[0]._id || resDest.body.data.docs[0].id;
        }
    });

    describe("Autenticação e Autorização", () => {
        test("TC01 - Bloquear acesso sem token JWT", async () => {
            const res = await req.get("/destinatarios");
            expect([401, 498]).toContain(res.statusCode);
        });
    });

    describe("Gerenciamento de Destinatários", () => {
        test("TC02 - Registrar novo Destinatário com sucesso", async () => {
            const res = await req
                .post("/destinatarios")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    nome: "Secretaria de Meio Ambiente de Vilhena",
                    documento: "04.123.456/0001-78",
                    tipo: "JURIDICA",                   // CORRIGIDO: Validador espera 'FISICA' | 'JURIDICA'
                    categoria: "PUBLICA",               // CORRIGIDO: Propriedade obrigatória incluída
                    endereco: "Av. Sabino Bezerra de Queiroz, 4000", // CORRIGIDO: Propriedade obrigatória incluída
                    telefone: "69999999999",
                    email: "meioambiente@vilhena.ro.gov.br"
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty("nome", "Secretaria de Meio Ambiente de Vilhena");
            
            // Guarda o ID do destinatário recém-criado para usarmos isoladamente no Soft Delete (TC07)
            destinatarioNovoId = res.body.data._id || res.body.data.id;
        });

        test("TC03 - Listar todos os destinatários cadastrados", async () => {
            const res = await req
                .get("/destinatarios")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("docs");
            expect(Array.isArray(res.body.data.docs)).toBe(true);
        });

        test("TC04 - Buscar detalhes de um destinatário por ID", async () => {
            if (!destinatarioId) return; 
            
            const res = await req
                .get(`/destinatarios/${destinatarioId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            const idRecebido = res.body.data._id || res.body.data.id;
            expect(idRecebido).toBe(destinatarioId);
        });

        test("TC05 - Atualizar dados de um destinatário", async () => {
            if (!destinatarioId) return;

            const res = await req
                .patch(`/destinatarios/${destinatarioId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    telefone: "69888888888"
                });

            expect(res.statusCode).toBe(200);
        });

        test("TC06 - Bloquear payload de criação com dados obrigatórios faltando", async () => {
            const res = await req
                .post("/destinatarios")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Força falha com propriedades parciais inválidas ativando o Zod
                    email: "falha@teste.com"
                });

            expect(res.statusCode).toBe(400);
        });

        test("TC07 - Inativar destinatário com sucesso (Soft Delete)", async () => {
            // Se o TC02 passou, destinatarioNovoId existe e é limpo para deletar de forma segura
            const idParaDeletar = destinatarioNovoId || destinatarioId;
            if (!idParaDeletar) return;

            const res = await req
                .delete(`/destinatarios/${idParaDeletar}`)
                .set("Authorization", `Bearer ${token}`);

            expect([200, 204]).toContain(res.statusCode);
        });
    });
});