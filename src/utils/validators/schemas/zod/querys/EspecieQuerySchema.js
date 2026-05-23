// src/utils/validators/schemas/zod/querys/EspecieQuerySchema.js

import { z } from 'zod';
import mongoose from 'mongoose';
import { CATEGORIA_ESPECIE_ENUM, TIPO_ESPECIE_ENUM, STATUS_ESPECIE_ENUM } from '../../../../../constants/especie.js';

export const EspecieIdSchema = z.string().refine(
  (id) => mongoose.Types.ObjectId.isValid(id),
  { message: 'ID de espécie inválido.' }
);

export const EspecieQuerySchema = z.object({
  nome: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.trim().length > 0, {
      message: 'Nome não pode ser vazio.',
    })
    .transform((val) => val?.trim()),
  categoria: z
    .enum(CATEGORIA_ESPECIE_ENUM, {
      errorMap: () => ({ message: `Categoria deve ser uma de: ${CATEGORIA_ESPECIE_ENUM.join(', ')}` }),
    })
    .optional(),
  tipo: z
    .enum(TIPO_ESPECIE_ENUM, {
      errorMap: () => ({ message: `Tipo deve ser um de: ${TIPO_ESPECIE_ENUM.join(', ')}` }),
    })
    .optional(),
  status: z
    .enum(STATUS_ESPECIE_ENUM, {
      errorMap: () => ({ message: "Status deve ser 'ATIVO' ou 'INATIVO'" }),
    })
    .optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: 'Page deve ser um número inteiro maior que 0.',
    }),
  limite: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
      message: 'Limite deve ser um número inteiro entre 1 e 100.',
    }),
});