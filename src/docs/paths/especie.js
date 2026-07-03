import commonResponses from '../schemas/swaggerCommonResponses.js';

const especiesRoutes = {
    '/especies': {
        post: {
            tags: ['Espécies'],
            summary: 'Cadastrar nova espécie',
            description: 'Cria uma nova espécie no viveiro. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/EspeciePost' },
                        examples: {
                            arvore: {
                                summary: 'Espécie arbórea',
                                value: {
                                    nome_popular: 'Ipê Amarelo',
                                    nome_cientifico: 'Handroanthus albus',
                                    variedade: 'Albus',
                                    categoria: 'ARBOREA',
                                    tipo: 'MUDA',
                                    quantidade_atual: 0,
                                    anotacoes: 'Espécie nativa do cerrado',
                                },
                            },
                            semente: {
                                summary: 'Espécie semente',
                                value: {
                                    nome_popular: 'Aroeira',
                                    variedade: 'Comum',
                                    categoria: 'NATIVA',
                                    tipo: 'SEMENTE',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: commonResponses[201]('#/components/schemas/Especie'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                403: commonResponses[403](),
                500: commonResponses[500](),
            },
        },
        get: {
            tags: ['Espécies'],
            summary: 'Listar espécies com filtros e paginação',
            description: 'Retorna lista paginada de espécies. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'nome',      in: 'query', schema: { type: 'string' }, description: 'Filtrar por nome popular (busca parcial)' },
                { name: 'categoria', in: 'query', schema: { type: 'string', enum: ['ARBOREA', 'FRUTIFERA', 'ORNAMENTAL', 'NATIVA', 'EXOTICA'] }, description: 'Filtrar por categoria' },
                { name: 'tipo',      in: 'query', schema: { type: 'string', enum: ['SEMENTE', 'MUDA'] }, description: 'Filtrar por tipo' },
                { name: 'status',    in: 'query', schema: { type: 'string', enum: ['ATIVO', 'INATIVO'] }, description: 'Filtrar por status' },
                { name: 'page',      in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',    in: 'query', schema: { type: 'integer', default: 10 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/EspeciePaginado'),
                401: commonResponses[401](),
                403: commonResponses[403](),
                500: commonResponses[500](),
            },
        },
    },

    '/especies/{id}': {
        get: {
            tags: ['Espécies'],
            summary: 'Buscar espécie por ID',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da espécie (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/Especie'),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
        patch: {
            tags: ['Espécies'],
            summary: 'Atualizar espécie',
            description: 'Atualiza dados de uma espécie. O campo `tipo` não pode ser alterado após a criação. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da espécie (ObjectId)' },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/EspeciePatch' },
                        examples: {
                            exemplo: {
                                summary: 'Atualizar nome e categoria',
                                value: { nome_popular: 'Ipê Roxo', categoria: 'ORNAMENTAL' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/Especie'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },

    '/especies/{id}/historico': {
        get: {
            tags: ['Espécies'],
            summary: 'Histórico de movimentações da espécie',
            description: 'Retorna todas as movimentações vinculadas a uma espécie.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da espécie (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/Movimentacao'),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },
};

export default especiesRoutes;