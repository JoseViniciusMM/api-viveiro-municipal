import commonResponses from '../schemas/swaggerCommonResponses.js';

const movimentacoesRoutes = {
    '/movimentacoes': {
        post: {
            tags: ['Movimentações'],
            summary: 'Registrar movimentação',
            description: `Registra uma movimentação de estoque. Disponível para **Administrador** e **Operador**.

**Regras:**
- \`EXPEDICAO\` exige \`destinatario_id\`
- \`PERDA\`, \`EXPEDICAO\` e \`MORTALIDADE\` exigem \`lote_id\``,
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/MovimentacaoPost' },
                        examples: {
                            entrada: {
                                summary: 'Entrada de estoque',
                                value: {
                                    tipo: 'ENTRADA',
                                    especie_id: '6650a1b2c3d4e5f6a7b8c9d1',
                                    quantidade: 300,
                                    justificativa: 'Recebimento de doação da prefeitura regional.',
                                },
                            },
                            expedicao: {
                                summary: 'Expedição para destinatário',
                                value: {
                                    tipo: 'EXPEDICAO',
                                    especie_id: '6650a1b2c3d4e5f6a7b8c9d1',
                                    lote_id: '6650a1b2c3d4e5f6a7b8c9d3',
                                    destinatario_id: '6650a1b2c3d4e5f6a7b8c9d4',
                                    quantidade: 50,
                                    justificativa: 'Expedição para reflorestamento do Parque Municipal.',
                                },
                            },
                            ajuste: {
                                summary: 'Ajuste de inventário',
                                value: {
                                    tipo: 'AJUSTE',
                                    especie_id: '6650a1b2c3d4e5f6a7b8c9d1',
                                    quantidade: -10,
                                    justificativa: 'Correção de divergência no inventário mensal.',
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
                403: commonResponses[403](),
                500: commonResponses[500](),
            },
        },
        get: {
            tags: ['Movimentações'],
            summary: 'Listar movimentações com filtros e paginação',
            description: 'Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'tipo',        in: 'query', schema: { type: 'string', enum: ['ENTRADA', 'SAIDA', 'AJUSTE', 'PERDA', 'EXPEDICAO', 'MORTALIDADE'] }, description: 'Filtrar por tipo' },
                { name: 'especieId',   in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de espécie' },
                { name: 'usuarioId',   in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de usuário' },
                { name: 'loteId',      in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de lote' },
                { name: 'data_inicio', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Data início (ISO 8601)' },
                { name: 'data_fim',    in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Data fim (ISO 8601)' },
                { name: 'page',        in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',      in: 'query', schema: { type: 'integer', default: 15 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/MovimentacaoPaginado'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/movimentacoes/{id}': {
        get: {
            tags: ['Movimentações'],
            summary: 'Buscar movimentação por ID',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da movimentação (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/Movimentacao'),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },

    '/movimentacoes/{id}/estorno': {
        post: {
            tags: ['Movimentações'],
            summary: 'Estornar movimentação',
            description: 'Cria uma movimentação de estorno revertendo o efeito da original. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da movimentação a estornar (ObjectId)' },
            ],
            responses: {
                201: commonResponses[201]('#/components/schemas/Movimentacao'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },

    '/movimentacoes/especie/{especie_id}': {
        get: {
            tags: ['Movimentações'],
            summary: 'Listar movimentações por espécie',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'especie_id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da espécie (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/MovimentacaoPaginado'),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },

    '/movimentacoes/lote/{lote_id}': {
        get: {
            tags: ['Movimentações'],
            summary: 'Listar movimentações por lote',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'lote_id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do lote (ObjectId)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/MovimentacaoPaginado'),
                401: commonResponses[401](),
                404: commonResponses[404](),
                500: commonResponses[500](),
            },
        },
    },
};

export default movimentacoesRoutes;