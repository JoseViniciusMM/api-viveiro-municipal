// src/docs/schemas/especieSchema.js
import { TIPO_ESPECIE_ENUM, CATEGORIA_ESPECIE_ENUM, STATUS_ESPECIE_ENUM } from '../../constants/especie.js';

const especieSchemas = {
    Especie: {
        type: 'object',
        properties: {
            _id: { type: 'string', format: 'ObjectId', description: 'ID da espécie' },
            nome_popular: { type: 'string', description: 'Nome popular da espécie' },
            nome_cientifico: { type: 'string', nullable: true, description: 'Nome científico (opcional)' },
            variedade: { type: 'string', nullable: true, description: 'Variedade (opcional)' },
            tipo: {
                type: 'string',
                enum: ['SEMENTE', 'MUDA'],
                description: 'Tipo de propagação',
            },
            categoria: {
                type: 'string',
                enum: ['ARBOREA', 'FRUTIFERA', 'ORNAMENTAL', 'NATIVA', 'EXOTICA'],
                description: 'Categoria da espécie',
            },
            quantidade_atual: {
                type: 'integer',
                minimum: 0,
                description: 'Quantidade atual em estoque',
            },
            status: {
                type: 'string',
                enum: STATUS_ESPECIE_ENUM,
                description: 'Status da espécie',
            },
            anotacoes: { type: 'string', description: 'Anotações sobre a espécie' },
            data_registro: { type: 'string', format: 'date-time', description: 'Data de criação' },
            data_att: { type: 'string', format: 'date-time', description: 'Data da última atualização' },
        },
    },
    EspeciePost: {
        type: 'object',
        required: ['nome_popular', 'tipo', 'categoria'],
        properties: {
            nome_popular: { type: 'string', description: 'Nome popular da espécie' },
            nome_cientifico: { type: 'string', description: 'Nome científico (opcional)' },
            variedade: { type: 'string', description: 'Variedade (opcional)' },
            tipo: {
                type: 'string',
                enum: TIPO_ESPECIE_ENUM,
                description: 'Tipo de propagação',
            },
            categoria: {
                type: 'string',
                enum: CATEGORIA_ESPECIE_ENUM,
                description: 'Categoria da espécie',
            },
            quantidade_atual: { type: 'integer', minimum: 0, default: 0 },
            anotacoes: { type: 'string', description: 'Anotações (opcional)' },
        },
        example: {
            nome_popular: 'Ipê Amarelo',
            nome_cientifico: 'Handroanthus albus',
            variedade: 'Albus',
            categoria: 'ARBOREA',
            tipo: 'MUDA',
            quantidade_atual: 0,
            anotacoes: 'Espécie nativa do cerrado',
        },
    },
    EspeciePatch: {
        type: 'object',
        properties: {
            nome_popular: { type: 'string', description: 'Nome popular (opcional)' },
            nome_cientifico: { type: 'string', description: 'Nome científico (opcional)' },
            variedade: { type: 'string', description: 'Variedade (opcional)' },
            categoria: {
                type: 'string',
                enum: CATEGORIA_ESPECIE_ENUM,
                description: 'Categoria (opcional)',
            },
            status: {
                type: 'string',
                enum: STATUS_ESPECIE_ENUM,
                description: 'Status (opcional)',
            },
            anotacoes: { type: 'string', description: 'Anotações (opcional)' },
        },
        example: {
            nome_popular: 'Ipê Amarelo Atualizado',
            anotacoes: 'Espécie com alta demanda',
        },
    },
    EspeciePaginado: {
        type: 'object',
        properties: {
            docs: {
                type: 'array',
                items: { $ref: '#/components/schemas/Especie' },
            },
            totalDocs: { type: 'integer', example: 45 },
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

export default especieSchemas;
