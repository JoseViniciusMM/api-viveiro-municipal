// utils/schemaUtils.js
import mongoose from 'mongoose';
import mongooseSchemaJsonSchema from 'mongoose-schema-jsonschema';
import getGlobalFakeMapping from '../../seeds/globalFakeMapping.js';

// Patch aplicado uma única vez aqui — todos os schemas herdam a capacidade .jsonSchema().
mongooseSchemaJsonSchema(mongoose);

/**
 * Retorna os nomes dos campos com select:false em um Mongoose schema.
 * Novos campos select:false adicionados ao model são cobertos automaticamente.
 *
 * @param {mongoose.Schema} mongooseSchema
 * @returns {string[]}
 */
export function getSelectFalseFields(mongooseSchema) {
  return Object.entries(mongooseSchema.paths)
    .filter(([, path]) => path.options?.select === false)
    .map(([key]) => key);
}

/**
 * Realiza uma cópia profunda do objeto.
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Verifica se o campo é um array de referência com base no schema do Mongoose.
 * @param {string} key - Nome do campo.
 * @param {mongoose.Schema} mongooseSchema - Schema do modelo do Mongoose.
 */
export function isRefField(key, mongooseSchema) {
  const path = mongooseSchema.path(key);
  return !!(
    path &&
    path.instance === 'Array' &&
    path.caster &&
    path.caster.options &&
    path.caster.options.ref
  );
}

/**
 * Gera um exemplo recursivamente a partir do JSON Schema, utilizando o mapeamento global para campos específicos.
 * Esta versão é assíncrona para aguardar a resolução do mapping.
 * @param {object} schema - O JSON Schema.
 * @param {string|null} key - Nome do campo atual (opcional).
 * @param {mongoose.Schema|null} mongooseSchema - Schema do modelo do Mongoose para detectar referências (opcional).
 */
export async function generateExample(schema, key = null, mongooseSchema = null) {
  // Se já houver um exemplo definido no schema, retorna-o
  if (schema.example !== undefined) {
    return schema.example;
  }

  // Obtém o mapping global resolvido
  const mapping = await getGlobalFakeMapping();

  // Se existir um gerador para o campo, utiliza-o para gerar um exemplo realista
  if (key && mapping[key]) {
    const generator = mapping[key];
    return typeof generator === 'function' ? generator() : generator;
  }

  // Se a propriedade for "_id", gera um ObjectId válido
  if (key === '_id') {
    return new mongoose.Types.ObjectId().toString();
  }

  // Se o schema for do tipo "object", gera exemplo para cada propriedade recursivamente
  if (schema.type === "object" && schema.properties) {
    const example = {};
    for (const [propKey, propertySchema] of Object.entries(schema.properties)) {
      example[propKey] = await await generateExample(propertySchema, propKey, mongooseSchema);
    }
    return example;
  }

  // Se for um array
  if (schema.type === "array" && schema.items) {
    // Se o campo for um array de referência, detectado automaticamente
    if (key && mongooseSchema && isRefField(key, mongooseSchema)) {
      return [
        { _id: new mongoose.Types.ObjectId().toString() },
        { _id: new mongoose.Types.ObjectId().toString() }
      ];
    }
    return [await await generateExample(schema.items, null, mongooseSchema)];
  }

  // Valores padrão para tipos primitivos
  if (schema.type === "string") {
    return "exemplo string";
  }
  if (schema.type === "number" || schema.type === "integer") {
    return 0;
  }
  if (schema.type === "boolean") {
    return true;
  }
  return null;
}

export function removeFieldsRecursively(obj, fieldsToRemove) {
  if (Array.isArray(obj)) {
    obj.forEach(item => removeFieldsRecursively(item, fieldsToRemove));
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (fieldsToRemove.includes(key)) {
        delete obj[key];
      } else {
        removeFieldsRecursively(obj[key], fieldsToRemove);
      }
    });
  }
}

/**
 * Gera a estrutura padrão de listagem paginada (mongoose-paginate-v2).
 *
 * @param {string} refName - Nome do schema referenciado em #/components/schemas/
 * @param {string} [description]
 * @returns {object} JSON Schema OpenAPI 3.0
 */
export function paginatedSchema(refName, description = '') {
  return {
    type: 'object',
    description,
    properties: {
      docs: {
        type: 'array',
        items: { $ref: `#/components/schemas/${refName}` },
      },
      totalDocs: { type: 'integer', example: 42 },
      limit: { type: 'integer', example: 10 },
      totalPages: { type: 'integer', example: 5 },
      page: { type: 'integer', example: 1 },
      hasPrevPage: { type: 'boolean', example: false },
      hasNextPage: { type: 'boolean', example: true },
    },
  };
}

/**
 * Infere o schema OpenAPI (type + enum se ZodEnum) de um campo Zod.
 * Suporta ZodEffects (campos com .transform()), ZodOptional e ZodEnum.
 */
export function zodToOpenApiSchema(field) {
  const schema = { type: 'string' };
  let inner = field._def?.typeName === 'ZodEffects' ? (field._def?.schema ?? field) : field;
  inner = inner._def?.innerType ?? inner;
  if (inner._def?.typeName === 'ZodEnum') schema.enum = inner._def.values;
  return schema;
}

/**
 * Gera array de parâmetros OpenAPI de filtro a partir de um Zod object schema.
 * Apenas campos com .describe() são incluídos.
 *
 * @param {import('zod').ZodObject<any>} zodSchema
 * @returns {{ name: string, in: 'query', schema: object, description: string }[]}
 */
export function buildFiltroParams(zodSchema) {
  return Object.entries(zodSchema.shape)
    .filter(([, field]) => field.description !== undefined)
    .map(([key, field]) => ({
      name: key, in: 'query',
      schema: zodToOpenApiSchema(field), description: field.description,
    }));
}

/**
 * Aplica um mapeamento de remoção de campos a um objeto de schemas.
 * Para cada entrada { schemaKey: [campos] }, remove os campos do schema correspondente.
 *
 * @param {Record<string, object>} schemasObj - Objeto de schemas (ex: usuariosSchemas)
 * @param {Record<string, string[]>} mapping  - Mapeamento { chaveDoSchema: [camposParaRemover] }
 */
export function applyRemovalMapping(schemasObj, mapping) {
  Object.entries(mapping).forEach(([key, fields]) => {
    removeFieldsRecursively(schemasObj[key], fields);
  });
}
