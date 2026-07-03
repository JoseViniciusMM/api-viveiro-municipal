import commonResponses from '../schemas/swaggerCommonResponses.js';

const destinatariosRoutes = {
    '/destinatarios': {
        post: {
            tags: ['Destinatários'],
            summary: 'Cadastrar novo destinatário',
            description: 'Cria um destinatário para expedições. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/DestinatarioPost' },
                        examples: {
                            pessoaJuridica: {
                                summary: 'Pessoa jurídica pública',
                                value: {
                                    nome: 'Secretaria Municipal de Meio Ambiente',
                                    tipo: 'JURIDICA',
                                    email: 'meioambiente@prefeitura.gov.br',
                                    telefone: '(11) 3333-4444',
                                    categoria: 'PUBLICA',
                                    documento: '12.345.678/0001-99',
                                    responsavel: 'Dra. Ana Paula Ferreira',
                                    endereco: 'Av. das Árvores, 500 — São Paulo/SP',
                                },
                            },
                            pessoaFisica: {
                                summary: 'Pessoa física privada',
                                value: {
                                    nome: 'Carlos Eduardo Ramos',
                                    tipo: 'FISICA',
                                    email: 'carlos@email.com',
                                    categoria: 'PRIVADA',
                                    documento: '123.456.789-00',
                                    endereco: 'Rua das Flores, 10 — São Paulo/SP',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: commonResponses[201]('#/components/schemas/Destinatario'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                409: commonResponses[409](),
                500: commonResponses[500](),
            },
        },
        get: {
            tags: ['Destinatários'],
            summary: 'Listar destinatários com filtros e paginação',
            description: 'Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'nome',      in: 'query', schema: { type: 'string' }, description: 'Filtrar por nome (busca parcial)' },
                { name: 'email',     in: 'query', schema: { type: 'string' }, description: 'Filtrar por e-mail' },
                { name: 'documento', in: 'query', schema: { type: 'string' }, description: 'Filtrar por CPF/CNPJ' },
                { name: 'tipo',      in: 'query', schema: { type: 'string', enum: ['FISICA', 'JURIDICA'] }, description: 'Filtrar por tipo de pessoa' },
                { name: 'categoria', in: 'query', schema: { type: 'string', enum: ['PUBLICA', 'PRIVADA', 'SOCIAL'] }, description: 'Filtrar por categoria' },
                { name: 'status',    in: 'query', schema: { type: 'string', enum: ['ATIVO', 'INATIVO'] }, description: 'Filtrar por status' },
                { name: 'page',      in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',    in: 'query', schema: { type: 'integer', default: 10 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/DestinatarioPaginado'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/destinatarios/{id}': {
        get: {
            tags: ['Destinatários'],
            summary: 'Buscar destinatário por ID',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do destinatário (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/Destinatario'),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
        patch: {
            tags: ['Destinatários'],
            summary: 'Atualizar destinatário',
            description: 'Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do destinatário (ObjectId)' },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/DestinatarioPatch' },
                        examples: {
                            exemplo: {
                                summary: 'Atualizar telefone e endereço',
                                value: { telefone: '(11) 98765-4321', endereco: 'Rua Nova, 200 — São Paulo/SP' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/Destinatario'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
        delete: {
            tags: ['Destinatários'],
            summary: 'Inativar destinatário',
            description: 'Marca o destinatário como inativo. Apenas **Administrador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do destinatário (ObjectId)' },
            ],
            responses: {
                200: { description: 'Destinatário inativado com sucesso' },
                401: commonResponses[401](),
                403: commonResponses[403](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },
};

export default destinatariosRoutes;