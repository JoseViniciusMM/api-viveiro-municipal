import commonResponses from '../schemas/swaggerCommonResponses.js';

const auditoriaRoutes = {
    '/auditoria/logs': {
        get: {
            tags: ['Auditoria'],
            summary: 'Listar logs de auditoria',
            description: 'Retorna registros de auditoria do sistema com filtros. Apenas **Administrador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'usuarioId',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID do usuário' },
                { name: 'acao',       in: 'query', schema: { type: 'string', enum: ['CRIAR_ESPECIE','ATUALIZAR_ESPECIE','INATIVAR_ESPECIE','CRIAR_MOVIMENTACAO','ESTORNAR_MOVIMENTACAO','CRIAR_LOTE','ATUALIZAR_FASE_LOTE','TRANSFERIR_LOTE','CANCELAR_LOTE','REGISTRAR_MORTALIDADE','CRIAR_ESTUFA','ATUALIZAR_ESTUFA','INATIVAR_ESTUFA','CRIAR_USUARIO','ATUALIZAR_USUARIO','INATIVAR_USUARIO','LOGIN','LOGOUT','ATIVAR_CONTA','RESETAR_SENHA','CRIAR_DESTINATARIO','ATUALIZAR_DESTINATARIO','INATIVAR_DESTINATARIO','EXPEDIR_LOTE'] }, description: 'Filtrar por ação' },
                { name: 'dataInicio', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Data início (ISO 8601)' },
                { name: 'dataFim',    in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Data fim (ISO 8601)' },
                { name: 'page',       in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limit',      in: 'query', schema: { type: 'integer', default: 20 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/LogAuditoriaPaginado'),
                401: commonResponses[401](),
                403: commonResponses[403](),
                500: commonResponses[500](),
            },
        },
    },
};

export default auditoriaRoutes;