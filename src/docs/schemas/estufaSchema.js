// src/docs/schemas/estufaSchema.js
import { STATUS_ESTUFA_ENUM } from '../../constants/estufa.js';

const estufaSchemas = {
    Estufa: {
        type: 'object',
        properties: {
            _id: { type: 'string', format: 'ObjectId', description: 'ID da estufa' },
            codigo_identificador: { type: 'string', description: 'Código único da estufa' },
            localizacao_estufa: { type: 'string', description: 'Local/nome da estufa' },
            localizacao_barraca: { type: 'string', description: 'Barraca onde está localizada' },
            localizacao_posicao: { type: 'string', description: 'Posição/fileira dentro da barraca' },
            capacidade_total: {
                type: 'integer',
                minimum: 0,
                description: 'Capacidade total de plantas/mudas',
            },
            status: {
                type: 'string',
                enum: STATUS_ESTUFA_ENUM,
                description: 'Status da estufa',
            },
            data_registro: { type: 'string', format: 'date-time', description: 'Data de criação' },
            data_att: { type: 'string', format: 'date-time', description: 'Data da última atualização' },
        },
    },
    EstufaPost: {
        type: 'object',
        required: ['localizacao_estufa', 'localizacao_barraca', 'localizacao_posicao', 'capacidade_total'],
        properties: {
            localizacao_estufa: { type: 'string', description: 'Local/nome da estufa' },
            localizacao_barraca: { type: 'string', description: 'Barraca onde está localizada' },
            localizacao_posicao: { type: 'string', description: 'Posição/fileira dentro da barraca' },
            capacidade_total: {
                type: 'integer',
                minimum: 1,
                description: 'Capacidade total de plantas/mudas',
            },
        },
        example: {
            localizacao_estufa: 'Estufa A',
            localizacao_barraca: 'Barraca 01',
            localizacao_posicao: 'Fileira 3',
            capacidade_total: 500,
        },
    },
    EstufaPatch: {
        type: 'object',
        properties: {
            localizacao_estufa: { type: 'string', description: 'Local/nome da estufa (opcional)' },
            localizacao_barraca: { type: 'string', description: 'Barraca (opcional)' },
            localizacao_posicao: { type: 'string', description: 'Posição (opcional)' },
            capacidade_total: { type: 'integer', minimum: 1, description: 'Capacidade total (opcional)' },
            status: {
                type: 'string',
                enum: STATUS_ESTUFA_ENUM,
                description: 'Status (opcional)',
            },
        },
        example: {
            status: 'Manutenção',
        },
    },
    EstufaPaginado: {
        type: 'object',
        properties: {
            docs: {
                type: 'array',
                items: { $ref: '#/components/schemas/Estufa' },
            },
            totalDocs: { type: 'integer', example: 12 },
            limit: { type: 'integer', example: 10 },
            page: { type: 'integer', example: 1 },
            pages: { type: 'integer', example: 2 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
            nextPage: { type: 'integer', nullable: true, example: 2 },
            prevPage: { type: 'integer', nullable: true, example: null },
        },
    },
};

export default estufaSchemas;
