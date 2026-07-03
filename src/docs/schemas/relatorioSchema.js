// src/docs/schemas/relatorioSchema.js
const relatorioSchemas = {
    RelatorioPaginado: {
        type: 'object',
        properties: {
            docs: {
                type: 'array',
                items: { type: 'object' },
                description: 'Resultados da busca (pode conter Lotes, Movimentações, etc)',
            },
            totalDocs: { type: 'integer', example: 120 },
            limit: { type: 'integer', example: 10 },
            page: { type: 'integer', example: 1 },
            pages: { type: 'integer', example: 12 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
            nextPage: { type: 'integer', nullable: true, example: 2 },
            prevPage: { type: 'integer', nullable: true, example: null },
        },
    },
};

export default relatorioSchemas;
