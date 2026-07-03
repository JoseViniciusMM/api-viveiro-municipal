import commonResponses from '../schemas/swaggerCommonResponses.js';

const usuariosRoutes = {
    '/usuarios': {
        post: {
            tags: ['Usuários'],
            summary: 'Cadastrar novo usuário',
            description: 'Cria um novo usuário no sistema. Apenas **Administrador**. O usuário receberá um e-mail para confirmar o cadastro e definir sua senha.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UsuarioPost' },
                        examples: {
                            administrador: {
                                summary: 'Criar Administrador',
                                value: {
                                    nome: 'João Silva',
                                    cpf: '123.456.789-00',
                                    email: 'joao@viveiro.com',
                                    telefone: '(11) 99999-0000',
                                    cargo: 'ADMINISTRADOR',
                                },
                            },
                            operador: {
                                summary: 'Criar Operador',
                                value: {
                                    nome: 'Maria Souza',
                                    cpf: '987.654.321-00',
                                    email: 'maria@viveiro.com',
                                    cargo: 'OPERADOR',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: commonResponses[201]('#/components/schemas/Usuario'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                403: commonResponses[403](),
                409: commonResponses[409](),
                500: commonResponses[500](),
            },
        },
        get: {
            tags: ['Usuários'],
            summary: 'Listar usuários com filtros e paginação',
            description: 'Retorna lista paginada de usuários. Apenas **Administrador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'nome',   in: 'query', schema: { type: 'string' },  description: 'Filtrar por nome (busca parcial)' },
                { name: 'email',  in: 'query', schema: { type: 'string', format: 'email' }, description: 'Filtrar por e-mail exato' },
                { name: 'ativo',  in: 'query', schema: { type: 'string', enum: ['true', 'false'] }, description: 'Filtrar por status ativo' },
                { name: 'page',   in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/UsuarioPaginado'),
                401: commonResponses[401](),
                403: commonResponses[403](),
                500: commonResponses[500](),
            },
        },
    },

    '/usuarios/confirmar-cadastro': {
        get: {
            tags: ['Usuários'],
            summary: 'Confirmar cadastro via link do e-mail (GET)',
            description: 'Endpoint acessado pelo link enviado por e-mail. Valida o token e redireciona para definição de senha.',
            security: [],
            parameters: [
                { name: 'token', in: 'query', required: true, schema: { type: 'string' }, description: 'Token de ativação recebido por e-mail' },
            ],
            responses: {
                200: { description: 'Cadastro confirmado com sucesso' },
                400: commonResponses[400](),
                500: commonResponses[500](),
            },
        },
        post: {
            tags: ['Usuários'],
            summary: 'Confirmar cadastro e definir senha (POST)',
            description: 'Confirma o cadastro e define a senha do usuário a partir do token recebido por e-mail.',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ConfirmarCadastroPost' },
                        examples: {
                            exemplo: {
                                summary: 'Confirmar com senha',
                                value: { token: 'token-recebido-por-email', senha: 'Senha@123' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: 'Conta ativada com sucesso' },
                400: commonResponses[400](),
                500: commonResponses[500](),
            },
        },
    },

    '/usuarios/perfil': {
        patch: {
            tags: ['Usuários'],
            summary: 'Atualizar o próprio perfil',
            description: 'O usuário autenticado atualiza seus próprios dados (nome, e-mail, telefone, senha). Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AtualizarPerfilPatch' },
                        examples: {
                            exemplo: {
                                summary: 'Atualizar nome e telefone',
                                value: { nome: 'João da Silva Sauro', telefone: '(11) 98888-7777' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/Usuario'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/usuarios/{id}': {
        get: {
            tags: ['Usuários'],
            summary: 'Buscar usuário por ID',
            description: 'Retorna os dados de um usuário específico. Apenas **Administrador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do usuário (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/Usuario'),
                401: commonResponses[401](),
                403: commonResponses[403](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
        patch: {
            tags: ['Usuários'],
            summary: 'Atualizar dados de um usuário',
            description: 'Atualiza dados, cargo ou status de um usuário. Apenas **Administrador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do usuário (ObjectId)' },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UsuarioUpdatePatch' },
                        examples: {
                            exemplo: {
                                summary: 'Alterar cargo e status',
                                value: { cargo: 'OPERADOR', status: 'ATIVO' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/Usuario'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                403: commonResponses[403](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
        delete: {
            tags: ['Usuários'],
            summary: 'Inativar usuário (soft delete)',
            description: 'Marca o usuário como inativo sem remover do banco. Apenas **Administrador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do usuário (ObjectId)' },
            ],
            responses: {
                200: { description: 'Usuário inativado com sucesso' },
                401: commonResponses[401](),
                403: commonResponses[403](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },
};

export default usuariosRoutes;