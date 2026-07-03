// src/docs/schemas/movimentacoesSchema.js
import { TIPO_MOVIMENTACAO_ENUM } from '../../constants/movimentacao.js';

const movimentacoesSchemas = {
    Movimentacao: {
        type: 'object',
        properties: {
            _id: { type: 'string', format: 'ObjectId', description: 'ID da movimentação' },
            tipo: {
                type: 'string',
                enum: TIPO_MOVIMENTACAO_ENUM,
                description: 'Tipo de movimentação',
            },
            especie_id: { type: 'string', format: 'ObjectId', description: 'ID da espécie movimentada' },
            lote_id: { type: 'string', format: 'ObjectId', nullable: true, description: 'ID do lote (obrigatório para PERDA, EXPEDICAO, MORTALIDADE)' },
            quantidade: { type: 'integer', description: 'Quantidade movimentada' },
            justificativa: { type: 'string', description: 'Motivo da movimentação' },
            usuario_id: { type: 'string', format: 'ObjectId', description: 'ID do usuário que realizou a movimentação' },
            destinatario_id: { type: 'string', format: 'ObjectId', nullable: true, description: 'ID do destinatário (obrigatório para EXPEDICAO)' },
            data_registro: { type: 'string', format: 'date-time', description: 'Data e hora da movimentação' },
            data_att: { type: 'string', format: 'date-time', description: 'Data da última atualização' },
        },
    },
    MovimentacaoPost: {
        type: 'object',
        required: ['tipo', 'especie_id', 'quantidade', 'justificativa'],
        properties: {
            tipo: {
                type: 'string',
                enum: Object.values(TIPO_MOVIMENTACAO_ENUM).filter(t => t !== 'ESTORNO'),
                description: 'Tipo de movimentação',
            },
            especie_id: { type: 'string', format: 'ObjectId', description: 'ID da espécie' },
            lote_id: { type: 'string', format: 'ObjectId', description: 'ID do lote (obrigatório para PERDA, EXPEDICAO, MORTALIDADE)' },
            quantidade: { type: 'integer', description: 'Quantidade movimentada (pode ser negativa para saída)' },
            justificativa: { type: 'string', description: 'Motivo da movimentação' },
            destinatario_id: { type: 'string', format: 'ObjectId', description: 'ID do destinatário (obrigatório para EXPEDICAO)' },
        },
        example: {
            tipo: 'ENTRADA',
            especie_id: '6650a1b2c3d4e5f6a7b8c9d1',
            quantidade: 300,
            justificativa: 'Recebimento de doação da prefeitura regional.',
        },
    },
    MovimentacaoPaginado: {
        type: 'object',
        properties: {
            docs: {
                type: 'array',
                items: { $ref: '#/components/schemas/Movimentacao' },
            },
            totalDocs: { type: 'integer', example: 234 },
            limit: { type: 'integer', example: 15 },
            page: { type: 'integer', example: 1 },
            pages: { type: 'integer', example: 16 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
            nextPage: { type: 'integer', nullable: true, example: 2 },
            prevPage: { type: 'integer', nullable: true, example: null },
        },
    },
};

export default movimentacoesSchemas;
