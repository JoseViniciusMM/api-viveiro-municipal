import commonResponses from '../schemas/swaggerCommonResponses.js';

const dashboardRoutes = {
    '/dashboard/geral': {
        get: {
            tags: ['Dashboard'],
            summary: 'Dados analíticos gerais',
            description: 'Retorna métricas consolidadas para o dashboard principal: totais de espécies, lotes ativos, movimentações recentes e ocupação de estufas. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            responses: {
                200: commonResponses[200]('#/components/schemas/DashboardGeral'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },
};

export default dashboardRoutes;