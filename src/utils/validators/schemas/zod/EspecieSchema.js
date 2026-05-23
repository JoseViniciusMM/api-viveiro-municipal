// src/utils/validators/schemas/zod/EspecieSchema.js

import { z } from 'zod';
import { CATEGORIA_ESPECIE_ENUM, TIPO_ESPECIE_ENUM, STATUS_ESPECIE_ENUM } from '../../../../constants/especie.js';
export { EspecieIdSchema, EspecieQuerySchema } from './querys/EspecieQuerySchema.js';

const EspecieSchema = z.object({
  nome_popular: z
    .string()
    .min(1, 'Campo nome popular é obrigatório.'),
  nome_cientifico: z
    .string()
    .optional(),
  variedade: z
    .string()
    .min(1, 'Campo variedade é obrigatório.'),
  categoria: z.enum(CATEGORIA_ESPECIE_ENUM, {
    errorMap: () => ({ message: `Categoria deve ser uma de: ${CATEGORIA_ESPECIE_ENUM.join(', ')}` }),
  }),
  tipo: z.enum(TIPO_ESPECIE_ENUM, {
    errorMap: () => ({ message: `Tipo deve ser um de: ${TIPO_ESPECIE_ENUM.join(', ')}` }),
  }),
  quantidade_atual: z
    .number()
    .int('Quantidade deve ser um número inteiro.')
    .min(0, 'Quantidade não pode ser negativa.')
    .optional()
    .default(0),
  observacoes: z
    .string()
    .optional(),
  status: z.enum(STATUS_ESPECIE_ENUM).default('ATIVO'),
});

const EspecieUpdateSchema = EspecieSchema
  .omit({ quantidade_atual: true, tipo: true })
  .partial();

export { EspecieSchema, EspecieUpdateSchema };