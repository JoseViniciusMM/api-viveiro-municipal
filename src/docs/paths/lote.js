import commonResponses from '../schemas/swaggerCommonResponses.js';

const lotesRoutes = {
    '/lotes': {
        post: {
            tags: ['Lotes'],
            summary: 'Criar novo lote',
            description: 'Cria um lote de produção vinculando espécies a uma estufa. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LotePost' },
                        examples: {
                            exemplo: {
                                summary: 'Criar lote com duas espécies',
                                value: {
                                    estufa_id: '6650a1b2c3d4e5f6a7b8c9d0',
                                    itens_especies: [
                                        { especie_id: '6650a1b2c3d4e5f6a7b8c9d1', quantidade_inicial: 200 },
                                        { especie_id: '6650a1b2c3d4e5f6a7b8c9d2', quantidade_inicial: 100 },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: commonResponses[201]('#/components/schemas/Lote'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                403: commonResponses[403](),
                500: commonResponses[500](),
            },
        },
        get: {
            tags: ['Lotes'],
            summary: 'Listar lotes com filtros e paginação',
            description: 'Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'busca',      in: 'query', schema: { type: 'string' }, description: 'Busca por código do lote' },
                { name: 'especieId',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de espécie' },
                { name: 'estufaId',   in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de estufa' },
                { name: 'fase',       in: 'query', schema: { type: 'string', enum: ['SEMEADURA', 'GERMINAÇÃO', 'PRODUÇÃO', 'PRONTO', 'FINALIZADO'] }, description: 'Filtrar por fase' },
                { name: 'status',     in: 'query', schema: { type: 'string', enum: ['ATIVO', 'INATIVO'] }, description: 'Filtrar por status' },
                { name: 'dataInicio', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Data início (ISO 8601)' },
                { name: 'dataFim',    in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Data fim (ISO 8601)' },
                { name: 'page',       in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',     in: 'query', schema: { type: 'integer', default: 15 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/LotePaginado'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/lotes/{id}': {
        get: {
            tags: ['Lotes'],
            summary: 'Buscar lote por ID',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do lote (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/Lote'),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
        delete: {
            tags: ['Lotes'],
            summary: 'Deletar/descartar lote',
            description: 'Remove o lote informando uma justificativa de descarte. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do lote (ObjectId)' },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoteDelecao' },
                        examples: {
                            exemplo: {
                                summary: 'Justificativa de descarte',
                                value: { justificativa: 'Lote contaminado por praga. Descarte sanitário obrigatório.' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: 'Lote descartado com sucesso' },
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },

    '/lotes/{id}/historico': {
        get: {
            tags: ['Lotes'],
            summary: 'Histórico de movimentações do lote',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do lote (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/Movimentacao'),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },

    '/lotes/{id}/fase': {
        patch: {
            tags: ['Lotes'],
            summary: 'Atualizar fase do lote',
            description: 'Avança ou retrocede a fase de produção do lote. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do lote (ObjectId)' },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoteFasePatch' },
                        examples: {
                            exemplo: {
                                summary: 'Avançar para produção',
                                value: { fase: 'PRODUÇÃO' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/Lote'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },

    '/lotes/{id}/transferir': {
        patch: {
            tags: ['Lotes'],
            summary: 'Transferir lote para outra estufa',
            description: 'Move o lote para uma nova estufa. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do lote (ObjectId)' },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoteTransferencia' },
                        examples: {
                            exemplo: {
                                summary: 'Transferir para nova estufa',
                                value: { nova_estufa_id: '6650a1b2c3d4e5f6a7b8c9d5' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/Lote'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },

    '/lotes/{id}/mortalidade': {
        post: {
            tags: ['Lotes'],
            summary: 'Registrar mortalidade no lote',
            description: 'Registra baixa de quantidade por morte de mudas/sementes. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do lote (ObjectId)' },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoteMortalidade' },
                        examples: {
                            exemplo: {
                                summary: 'Registrar mortalidade',
                                value: {
                                    especie_id: '6650a1b2c3d4e5f6a7b8c9d1',
                                    quantidade: 15,
                                    justificativa: 'Morte por excesso de irrigação na semana 03.',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: commonResponses[201]('#/components/schemas/Movimentacao'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },
};

export default lotesRoutes;