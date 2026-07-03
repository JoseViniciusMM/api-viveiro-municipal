// src/docs/paths/auth.js
import commonResponses from '../schemas/swaggerCommonResponses.js';

const authRoutes = {
    '/auth/login': {
        post: {
            tags: ['Auth'],
            summary: 'Autenticar usuário',
            description: 'Retorna access token + refresh token.',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoginPost' },
                        examples: {
                            admin: {
                                summary: 'Administrador',
                                value: { email: 'admin@viveiro.com', senha: 'Admin@123!' },
                            },
                            adminCpf: {
                                summary: 'Administrador (via CPF)',
                                value: { cpf: '123.456.789-00', senha: 'Admin@123' },
                            },
                            operador: {
                                summary: 'Operador',
                                value: { email: 'operador@viveiro.com', senha: 'Admin@123' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/RespostaLogin'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/auth/logout': {
        post: {
            tags: ['Auth'],
            summary: 'Encerrar sessão',
            security: [{ bearerAuth: [] }],
            responses: {
                204: { description: 'Sessão encerrada com sucesso' },
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/auth/refresh-token': {
        post: {
            tags: ['Auth'],
            summary: 'Renovar access token via refresh token',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['token'],
                            properties: {
                                token: { type: 'string', description: 'Refresh token' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/RespostaLogin'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/auth/esqueceu-senha': {
        post: {
            tags: ['Auth'],
            summary: 'Solicitar redefinição de senha por e-mail',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email'],
                            properties: {
                                email: { type: 'string', format: 'email', example: 'joao@viveiro.com' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: 'E-mail de redefinição enviado (retorna 200 mesmo se o e-mail não existir)' },
                400: commonResponses[400](),
                500: commonResponses[500](),
            },
        },
    },
};

export default authRoutes;