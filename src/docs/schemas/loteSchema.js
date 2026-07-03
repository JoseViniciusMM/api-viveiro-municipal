// src/docs/schemas/loteSchema.js
import { FASE_LOTE_ENUM, STATUS_ENUM } from '../../constants/lote.js';

const loteSchemas = {
    ItensEspecie: {
        type: 'object',
        properties: {
            especie_id: { type: 'string', format: 'ObjectId', description: 'ID da espécie' },
            quantidade_inicial: { type: 'integer', minimum: 1, description: 'Quantidade inicial plantada' },
            quantidade_atual: { type: 'integer', minimum: 0, description: 'Quantidade atual' },
        },
    },
    Lote: {
        type: 'object',
        properties: {
            _id: { type: 'string', format: 'ObjectId', description: 'ID do lote' },
            codigo: { type: 'string', description: 'Código único do lote' },
            fase: {
                type: 'string',
                enum: FASE_LOTE_ENUM,
                description: 'Fase atual do lote',
            },
            status: {
                type: 'string',
                enum: STATUS_ENUM,
                description: 'Status do lote',
            },
            estufa_id: { type: 'string', format: 'ObjectId', nullable: true, description: 'ID da estufa onde está localizado' },
            itens_especies: {
                type: 'array',
                items: { $ref: '#/components/schemas/ItensEspecie' },
                description: 'Espécies contidas no lote',
            },
            data_inicio: { type: 'string', format: 'date-time', description: 'Data de início da produção' },
            data_registro: { type: 'string', format: 'date-time', description: 'Data de criação do lote' },
            data_att: { type: 'string', format: 'date-time', description: 'Data da última atualização' },
        },
    },
    LotePost: {
        type: 'object',
        required: ['estufa_id', 'itens_especies'],
        properties: {
            estufa_id: { type: 'string', format: 'ObjectId', description: 'ID da estufa' },
            itens_especies: {
                type: 'array',
                minItems: 1,
                items: {
                    type: 'object',
                    required: ['especie_id', 'quantidade_inicial'],
                    properties: {
                        especie_id: { type: 'string', format: 'ObjectId', description: 'ID da espécie' },
                        quantidade_inicial: { type: 'integer', minimum: 1, description: 'Quantidade inicial' },
                    },
                },
            },
        },
        example: {
            estufa_id: '6650a1b2c3d4e5f6a7b8c9d0',
            itens_especies: [
                { especie_id: '6650a1b2c3d4e5f6a7b8c9d1', quantidade_inicial: 200 },
                { especie_id: '6650a1b2c3d4e5f6a7b8c9d2', quantidade_inicial: 100 },
            ],
        },
    },
    LoteDelecao: {
        type: 'object',
        required: ['justificativa'],
        properties: {
            justificativa: { type: 'string', description: 'Justificativa do descarte' },
        },
        example: {
            justificativa: 'Lote contaminado por praga. Descarte sanitário obrigatório.',
        },
    },
    LotePaginado: {
        type: 'object',
        properties: {
            docs: {
                type: 'array',
                items: { $ref: '#/components/schemas/Lote' },
            },
            totalDocs: { type: 'integer', example: 87 },
            limit: { type: 'integer', example: 15 },
            page: { type: 'integer', example: 1 },
            pages: { type: 'integer', example: 6 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
            nextPage: { type: 'integer', nullable: true, example: 2 },
            prevPage: { type: 'integer', nullable: true, example: null },
        },
    },
};

export default loteSchemas;
