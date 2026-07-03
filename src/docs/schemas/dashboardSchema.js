// src/docs/schemas/dashboardSchema.js
const dashboardSchemas = {
    MetricasEspecie: {
        type: 'object',
        properties: {
            total: { type: 'integer', example: 45 },
            ativos: { type: 'integer', example: 42 },
            inativos: { type: 'integer', example: 3 },
            quantidade_total: { type: 'integer', example: 12500 },
        },
    },
    MetricasLote: {
        type: 'object',
        properties: {
            total: { type: 'integer', example: 28 },
            ativos: { type: 'integer', example: 25 },
            por_fase: {
                type: 'object',
                properties: {
                    SEMEADURA: { type: 'integer', example: 5 },
                    GERMINACAO: { type: 'integer', example: 8 },
                    PRODUCAO: { type: 'integer', example: 10 },
                    PRONTO: { type: 'integer', example: 2 },
                    FINALIZADO: { type: 'integer', example: 3 },
                },
            },
        },
    },
    MetricasEsqufa: {
        type: 'object',
        properties: {
            total: { type: 'integer', example: 12 },
            livres: { type: 'integer', example: 3 },
            ocupadas: { type: 'integer', example: 8 },
            indisponiveis: { type: 'integer', example: 1 },
            taxa_ocupacao: { type: 'number', format: 'float', example: 66.67 },
        },
    },
    MetricasMovimentacao: {
        type: 'object',
        properties: {
            total_mes: { type: 'integer', example: 156 },
            entradas: { type: 'integer', example: 45 },
            saidas: { type: 'integer', example: 38 },
            expedições: { type: 'integer', example: 52 },
            ajustes: { type: 'integer', example: 21 },
        },
    },
    DashboardGeral: {
        type: 'object',
        properties: {
            especies: { $ref: '#/components/schemas/MetricasEspecie' },
            lotes: { $ref: '#/components/schemas/MetricasLote' },
            estufas: { $ref: '#/components/schemas/MetricasEsqufa' },
            movimentacoes: { $ref: '#/components/schemas/MetricasMovimentacao' },
            data_atualizacao: { type: 'string', format: 'date-time' },
        },
    },
};

export default dashboardSchemas;
