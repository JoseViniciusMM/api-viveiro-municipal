// src/docs/schemas/destinatarioSchema.js
import { TIPO_PESSOA_ENUM, CATEGORIA_USUARIO_ENUM, STATUS_DESTINATARIO_ENUM } from '../../constants/destinatario.js';

const destinatarioSchemas = {
    Destinatario: {
        type: 'object',
        properties: {
            _id: { type: 'string', format: 'ObjectId', description: 'ID do destinatário' },
            nome: { type: 'string', description: 'Nome ou razão social do destinatário' },
            tipo: {
                type: 'string',
                enum: TIPO_PESSOA_ENUM,
                description: 'Tipo de pessoa',
            },
            email: { type: 'string', format: 'email', description: 'E-mail' },
            telefone: { type: 'string', nullable: true, description: 'Telefone (opcional)' },
            categoria: {
                type: 'string',
                enum: CATEGORIA_USUARIO_ENUM,
                description: 'Categoria do destinatário',
            },
            documento: { type: 'string', description: 'CPF (pessoa física) ou CNPJ (pessoa jurídica)' },
            responsavel: { type: 'string', nullable: true, description: 'Nome do responsável (opcional)' },
            endereco: { type: 'string', description: 'Endereço completo' },
            status: {
                type: 'string',
                enum: STATUS_DESTINATARIO_ENUM,
                description: 'Status do destinatário',
            },
            data_registro: { type: 'string', format: 'date-time', description: 'Data de criação' },
            data_att: { type: 'string', format: 'date-time', description: 'Data da última atualização' },
        },
    },
    DestinatarioPost: {
        type: 'object',
        required: ['nome', 'tipo', 'email', 'categoria', 'documento', 'endereco'],
        properties: {
            nome: { type: 'string', description: 'Nome ou razão social' },
            tipo: {
                type: 'string',
                enum: TIPO_PESSOA_ENUM,
                description: 'Tipo de pessoa',
            },
            email: { type: 'string', format: 'email', description: 'E-mail' },
            telefone: { type: 'string', description: 'Telefone (opcional)' },
            categoria: {
                type: 'string',
                enum: CATEGORIA_USUARIO_ENUM,
                description: 'Categoria',
            },
            documento: { type: 'string', description: 'CPF ou CNPJ' },
            responsavel: { type: 'string', description: 'Responsável (opcional, recomendado para pessoa jurídica)' },
            endereco: { type: 'string', description: 'Endereço completo' },
        },
        example: {
            nome: 'Secretaria Municipal de Meio Ambiente',
            tipo: 'JURIDICA',
            email: 'meioambiente@prefeitura.gov.br',
            telefone: '(11) 3333-4444',
            categoria: 'PUBLICA',
            documento: '12.345.678/0001-99',
            responsavel: 'Dra. Ana Paula Ferreira',
            endereco: 'Av. das Árvores, 500 — São Paulo/SP',
        },
    },
    DestinatarioPatch: {
        type: 'object',
        properties: {
            nome: { type: 'string', description: 'Nome ou razão social (opcional)' },
            email: { type: 'string', format: 'email', description: 'E-mail (opcional)' },
            telefone: { type: 'string', description: 'Telefone (opcional)' },
            responsavel: { type: 'string', description: 'Responsável (opcional)' },
            endereco: { type: 'string', description: 'Endereço (opcional)' },
            status: {
                type: 'string',
                enum: STATUS_DESTINATARIO_ENUM,
                description: 'Status (opcional)',
            },
        },
        example: {
            telefone: '(11) 98765-4321',
            endereco: 'Rua Nova, 200 — São Paulo/SP',
        },
    },
    DestinatarioPaginado: {
        type: 'object',
        properties: {
            docs: {
                type: 'array',
                items: { $ref: '#/components/schemas/Destinatario' },
            },
            totalDocs: { type: 'integer', example: 42 },
            limit: { type: 'integer', example: 10 },
            page: { type: 'integer', example: 1 },
            pages: { type: 'integer', example: 5 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
            nextPage: { type: 'integer', nullable: true, example: 2 },
            prevPage: { type: 'integer', nullable: true, example: null },
        },
    },
};

export default destinatarioSchemas;
