// src/docs/schemas/usuarioSchema.js
import { TIPO_USUARIO_ENUM, STATUS_USUARIO_ENUM } from '../../constants/usuario.js';

const usuarioSchemas = {
    Usuario: {
        type: 'object',
        properties: {
            _id: { type: 'string', format: 'ObjectId', description: 'ID do usuário' },
            nome: { type: 'string', description: 'Nome completo do usuário' },
            cpf: { type: 'string', pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$', description: 'CPF do usuário' },
            email: { type: 'string', format: 'email', description: 'E-mail do usuário' },
            telefone: { type: 'string', description: 'Telefone do usuário (opcional)' },
            cargo: { type: 'string', enum: TIPO_USUARIO_ENUM, description: 'Cargo do usuário' },
            status: { type: 'string', enum: STATUS_USUARIO_ENUM, description: 'Status da conta' },
            data_registro: { type: 'string', format: 'date-time', description: 'Data de criação' },
            data_att: { type: 'string', format: 'date-time', description: 'Data da última atualização' },
        },
    },
    UsuarioPost: {
        type: 'object',
        required: ['nome', 'cpf', 'email', 'cargo'],
        properties: {
            nome: { type: 'string', description: 'Nome completo do usuário' },
            cpf: { type: 'string', pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$', description: 'CPF do usuário' },
            email: { type: 'string', format: 'email', description: 'E-mail do usuário' },
            telefone: { type: 'string', description: 'Telefone do usuário (opcional)' },
            cargo: { type: 'string', enum: TIPO_USUARIO_ENUM, description: 'Cargo do usuário' },
        },
        example: {
            nome: 'João Silva',
            cpf: '123.456.789-00',
            email: 'joao@viveiro.com',
            telefone: '(11) 99999-0000',
            cargo: 'OPERADOR',
        },
    },
    ConfirmarCadastroPost: {
        type: 'object',
        required: ['token', 'senha'],
        properties: {
            token: { type: 'string', description: 'Token de ativação recebido por e-mail' },
            senha: { type: 'string', format: 'password', description: 'Nova senha do usuário' },
        },
        example: {
            token: 'token-recebido-por-email',
            senha: 'Senha@123',
        },
    },
    AtualizarPerfilPatch: {
        type: 'object',
        properties: {
            nome: { type: 'string', description: 'Nome completo (opcional)' },
            email: { type: 'string', format: 'email', description: 'E-mail (opcional)' },
            telefone: { type: 'string', description: 'Telefone (opcional)' },
            senha_atual: { type: 'string', format: 'password', description: 'Senha atual (obrigatório se mudar senha)' },
            senha_nova: { type: 'string', format: 'password', description: 'Nova senha (opcional)' },
        },
        example: {
            nome: 'João da Silva Sauro',
            telefone: '(11) 98888-7777',
        },
    },
    UsuarioUpdatePatch: {
        type: 'object',
        properties: {
            nome: { type: 'string', description: 'Nome completo (opcional)' },
            email: { type: 'string', format: 'email', description: 'E-mail (opcional)' },
            telefone: { type: 'string', description: 'Telefone (opcional)' },
            cargo: { type: 'string', enum: TIPO_USUARIO_ENUM, description: 'Cargo (opcional)' },
            status: { type: 'string', enum: STATUS_USUARIO_ENUM, description: 'Status (opcional)' },
        },
        example: {
            cargo: 'OPERADOR',
            status: 'ATIVO',
        },
    },
    UsuarioPaginado: {
        type: 'object',
        properties: {
            docs: {
                type: 'array',
                items: { $ref: '#/components/schemas/Usuario' },
            },
            totalDocs: { type: 'integer', example: 25 },
            limit: { type: 'integer', example: 10 },
            page: { type: 'integer', example: 1 },
            pages: { type: 'integer', example: 3 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
            nextPage: { type: 'integer', nullable: true, example: 2 },
            prevPage: { type: 'integer', nullable: true, example: null },
        },
    },
};

export default usuarioSchemas;
