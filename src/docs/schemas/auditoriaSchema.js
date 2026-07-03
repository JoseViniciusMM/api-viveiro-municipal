// src/docs/schemas/auditoriaSchema.js
import { AUDITORIA_ACOES } from '../../constants/auditoria.js';

const auditoriaSchemas = {
    LogAuditoria: {
        type: 'object',
        properties: {
            _id: { type: 'string', format: 'ObjectId', description: 'ID do log de auditoria' },
            usuario_id: { type: 'string', format: 'ObjectId', description: 'ID do usuário que realizou a ação' },
            acao: {
                type: 'string',
                enum: Object.values(AUDITORIA_ACOES),
                description: 'Ação realizada',
            },
            detalhes_mudanca: {
                type: 'object',
                description: 'Detalhes das mudanças realizadas',
                example: { campo: 'valor antigo -> valor novo' },
            },
            data_registro: { type: 'string', format: 'date-time', description: 'Data e hora do registro' },
        },
    },
    LogAuditoriaPaginado: {
        type: 'object',
        properties: {
            docs: {
                type: 'array',
                items: { $ref: '#/components/schemas/LogAuditoria' },
            },
            totalDocs: { type: 'integer', example: 150 },
            limit: { type: 'integer', example: 20 },
            page: { type: 'integer', example: 1 },
            pages: { type: 'integer', example: 8 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
            nextPage: { type: 'integer', nullable: true, example: 2 },
            prevPage: { type: 'integer', nullable: true, example: null },
        },
    },
};

export default auditoriaSchemas;
