import commonResponses from '../schemas/swaggerCommonResponses.js';
import { FASE_LOTE_ENUM } from '../../constants/lote.js';
import { TIPO_MOVIMENTACAO_ENUM } from '../../constants/movimentacao.js';
import { TIPO_ESPECIE_ENUM, CATEGORIA_ESPECIE_ENUM, STATUS_ESPECIE_ENUM } from '../../constants/especie.js';
import { STATUS_ESTUFA_ENUM } from '../../constants/estufa.js';
import { TIPO_USUARIO_ENUM, STATUS_USUARIO_ENUM } from '../../constants/usuario.js';
import { TIPO_PESSOA_ENUM, CATEGORIA_USUARIO_ENUM, STATUS_DESTINATARIO_ENUM } from '../../constants/destinatario.js';
import { AUDITORIA_ACOES } from '../../constants/auditoria.js';

const relatoriosRoutes = {
    '/relatorios/lotes': {
        get: {
            tags: ['Relatórios'],
            summary: 'Relatório de lotes',
            description: 'Lista histórico de lotes com filtros avançados. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'especie_id', in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de espécie' },
                { name: 'estufa_id',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de estufa' },
                { name: 'fase',       in: 'query', schema: { type: 'string', enum: FASE_LOTE_ENUM }, description: 'Filtrar por fase' },
                { name: 'status',     in: 'query', schema: { type: 'string', enum: ['ATIVO', 'INATIVO'] }, description: 'Filtrar por status' },
                { name: 'data_inicio',in: 'query', schema: { type: 'string', format: 'date' }, description: 'Data início' },
                { name: 'data_fim',   in: 'query', schema: { type: 'string', format: 'date' }, description: 'Data fim' },
                { name: 'page',       in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',     in: 'query', schema: { type: 'integer', default: 20 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/LotePaginado'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/relatorios/movimentacoes': {
        get: {
            tags: ['Relatórios'],
            summary: 'Relatório de movimentações',
            description: 'Lista movimentações com filtros avançados para relatórios gerenciais. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'especie_id',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de espécie' },
                { name: 'usuario_id',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de usuário' },
                { name: 'lote_id',     in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de lote' },
                { name: 'tipo',        in: 'query', schema: { type: 'string', enum: Object.values(TIPO_MOVIMENTACAO_ENUM).filter(t => t !== 'ESTORNO') }, description: 'Filtrar por tipo' },
                { name: 'data_inicio', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Data início' },
                { name: 'data_fim',    in: 'query', schema: { type: 'string', format: 'date' }, description: 'Data fim' },
                { name: 'page',        in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',      in: 'query', schema: { type: 'integer', default: 20 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/MovimentacaoPaginado'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/relatorios/mortalidade': {
        get: {
            tags: ['Relatórios'],
            summary: 'Relatório de mortalidade',
            description: 'Lista registros de mortalidade por período. **Requer data_inicio e data_fim.** Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'especie_id',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID de espécie' },
                { name: 'data_inicio', in: 'query', required: true, schema: { type: 'string', format: 'date' }, description: 'Data início (obrigatório)' },
                { name: 'data_fim',    in: 'query', required: true, schema: { type: 'string', format: 'date' }, description: 'Data fim (obrigatório)' },
                { name: 'page',        in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',      in: 'query', schema: { type: 'integer', default: 20 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/MovimentacaoPaginado'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/relatorios/especies': {
        get: {
            tags: ['Relatórios'],
            summary: 'Relatório de espécies',
            description: 'Lista espécies com filtros. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'nome',       in: 'query', schema: { type: 'string' }, description: 'Filtrar por nome científico (busca parcial)' },
                { name: 'categoria',  in: 'query', schema: { type: 'string', enum: CATEGORIA_ESPECIE_ENUM }, description: 'Filtrar por categoria' },
                { name: 'tipo',       in: 'query', schema: { type: 'string', enum: TIPO_ESPECIE_ENUM }, description: 'Filtrar por tipo (SEMENTE ou MUDA)' },
                { name: 'status',     in: 'query', schema: { type: 'string', enum: STATUS_ESPECIE_ENUM }, description: 'Filtrar por status' },
                { name: 'page',       in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',     in: 'query', schema: { type: 'integer', default: 20 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/EspeciePaginado'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/relatorios/estufas': {
        get: {
            tags: ['Relatórios'],
            summary: 'Relatório de estufas',
            description: 'Lista estufas com filtros. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'busca',                in: 'query', schema: { type: 'string' }, description: 'Busca por código ou localização' },
                { name: 'localizacao_estufa',   in: 'query', schema: { type: 'string' }, description: 'Filtrar por localização da estufa' },
                { name: 'localizacao_barraca',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por localização da barraca' },
                { name: 'localizacao_posicao',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por posição' },
                { name: 'status',               in: 'query', schema: { type: 'string', enum: STATUS_ESTUFA_ENUM }, description: 'Filtrar por status' },
                { name: 'capacidade_minima',    in: 'query', schema: { type: 'integer' }, description: 'Capacidade mínima' },
                { name: 'capacidade_maxima',    in: 'query', schema: { type: 'integer' }, description: 'Capacidade máxima' },
                { name: 'page',                 in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',               in: 'query', schema: { type: 'integer', default: 20 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/EstufaPaginado'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/relatorios/usuarios': {
        get: {
            tags: ['Relatórios'],
            summary: 'Relatório de usuários',
            description: 'Lista usuários com filtros. Apenas **Administrador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'nome',   in: 'query', schema: { type: 'string' }, description: 'Filtrar por nome (busca parcial)' },
                { name: 'cpf',    in: 'query', schema: { type: 'string' }, description: 'Filtrar por CPF' },
                { name: 'cargo',  in: 'query', schema: { type: 'string', enum: TIPO_USUARIO_ENUM }, description: 'Filtrar por cargo' },
                { name: 'status', in: 'query', schema: { type: 'string', enum: STATUS_USUARIO_ENUM }, description: 'Filtrar por status' },
                { name: 'page',   in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/UsuarioPaginado'),
                401: commonResponses[401](),
                403: commonResponses[403](),
                500: commonResponses[500](),
            },
        },
    },

    '/relatorios/destinatarios': {
        get: {
            tags: ['Relatórios'],
            summary: 'Relatório de destinatários',
            description: 'Lista destinatários com filtros. Disponível para **Administrador** e **Operador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'nome',       in: 'query', schema: { type: 'string' }, description: 'Filtrar por nome (busca parcial)' },
                { name: 'email',      in: 'query', schema: { type: 'string' }, description: 'Filtrar por e-mail' },
                { name: 'documento',  in: 'query', schema: { type: 'string' }, description: 'Filtrar por CPF/CNPJ' },
                { name: 'tipo',       in: 'query', schema: { type: 'string', enum: TIPO_PESSOA_ENUM }, description: 'Filtrar por tipo (FISICA ou JURIDICA)' },
                { name: 'categoria',  in: 'query', schema: { type: 'string', enum: CATEGORIA_USUARIO_ENUM }, description: 'Filtrar por categoria' },
                { name: 'status',     in: 'query', schema: { type: 'string', enum: STATUS_DESTINATARIO_ENUM }, description: 'Filtrar por status' },
                { name: 'page',       in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',     in: 'query', schema: { type: 'integer', default: 20 }, description: 'Itens por página (máx 100)' },
            ],
            responses: {
                200: commonResponses[200]('#/components/schemas/DestinatarioPaginado'),
                401: commonResponses[401](),
                500: commonResponses[500](),
            },
        },
    },

    '/relatorios/auditoria': {
        get: {
            tags: ['Relatórios'],
            summary: 'Relatório de auditoria',
            description: 'Lista logs de auditoria do sistema. Apenas **Administrador**.',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'usuario_id', in: 'query', schema: { type: 'string' }, description: 'Filtrar por ID do usuário' },
                { name: 'acao',       in: 'query', schema: { type: 'string', enum: Object.values(AUDITORIA_ACOES) }, description: 'Filtrar por ação' },
                { name: 'data_inicio', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Data início (ISO 8601)' },
                { name: 'data_fim',    in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Data fim (ISO 8601)' },
                { name: 'page',        in: 'query', schema: { type: 'integer', default: 1 },  description: 'Página' },
                { name: 'limite',      in: 'query', schema: { type: 'integer', default: 20 }, description: 'Itens por página (máx 100)' },
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

export default relatoriosRoutes;