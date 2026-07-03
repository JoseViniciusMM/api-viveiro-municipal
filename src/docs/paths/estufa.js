import commonResponses from '../schemas/swaggerCommonResponses.js';

const estufasRoutes = {
    '/estufas': {
        post: {
            tags: ['Estufas'],
            summary: 'Cadastrar nova estufa',
            description: 'Cria uma nova estufa/espaço físico. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/EstufaPost' },
                        examples: {
                            exemplo: {
                                summary: 'Nova estufa',
                                value: {
                                    localizacao_estufa: 'Estufa A',
                                    localizacao_barraca: 'Barraca 01',
                                    localizacao_posicao: 'Fileira 3',
                                    capacidade_total: 500,
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: commonResponses[201]('#/components/schemas/Estufa'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                403: commonResponses[403](),
                409: commonResponses[409](),
                500: commonResponses[500](),
            },
        },
        get: {
            tags: ['Estufas'],
            summary: 'Listar estufas com filtros e paginação',
            description: 'Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'status',               in: 'query', schema: { type: 'string', enum: ['Livre', 'Ocupada', 'Inativo'] }, description: 'Filtrar por status' },
                { name: 'codigo_identificador', in: 'query', schema: { type: 'string' }, description: 'Filtrar por código identificador' },
                { name: 'localizacao_estufa',   in: 'query', schema: { type: 'string' }, description: 'Filtrar por localização da estufa' },
                { name: 'localizacao_barraca',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por localização da barraca' },
                { name: 'localizacao_posicao',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por posição' },
                { name: 'page',                 in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',               in: 'query', schema: { type: 'integer', default: 10 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/EstufaPaginado'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/estufas/{id}': {
        get: {
            tags: ['Estufas'],
            summary: 'Buscar estufa por ID',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da estufa (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/Estufa'),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
        patch: {
            tags: ['Estufas'],
            summary: 'Atualizar estufa',
            description: 'Atualiza dados ou status de uma estufa. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da estufa (ObjectId)' },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/EstufaPatch' },
                        examples: {
                            exemplo: {
                                summary: 'Atualizar status',
                                value: { status: 'Manutenção' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/Estufa'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
        delete: {
            tags: ['Estufas'],
            summary: 'Inativar estufa',
            description: 'Marca a estufa como inativa. Apenas **Administrador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da estufa (ObjectId)' },
            ],
            responses: {
                200: { description: 'Estufa inativada com sucesso' },
                401: commonResponses[401](),
                403: commonResponses[403](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },
};

export default estufasRoutes;