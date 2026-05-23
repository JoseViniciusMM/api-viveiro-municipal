import { z } from 'zod';
import mongoose from 'mongoose';
import objectIdSchema from './ObjectIdSchema.js';

export { MovimentacaoIdSchema, MovimentacaoQuerySchema } from './querys/MovimentacaoQuerySchema.js';

const TIPO_MOVIMENTACAO_ENUM = ['ENTRADA', 'SAIDA', 'AJUSTE', 'PERDA', 'EXPEDICAO', 'MORTALIDADE'];

const MovimentacaoSchema = z.object({
  especie_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), 'ID da espécie é obrigatório'),
  tipo: z.enum(TIPO_MOVIMENTACAO_ENUM, {
    errorMap: () => ({ message: `Tipo inválido. Use: ${TIPO_MOVIMENTACAO_ENUM.join(', ')}` }),
  }),
  quantidade: z.number().positive('A quantidade deve ser um número positivo'),
  justificativa: z.string().min(5, 'A justificativa deve ser detalhada para fins de auditoria'),
  lote_id: z
    .string()
    .optional()
    .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), 'ID do lote inválido'),
  destinatario_id: z
    .string()
    .optional()
    .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), 'ID do destinatário inválido'),
}).superRefine((dados, ctx) => {
  if (dados.tipo === 'EXPEDICAO' && !dados.destinatario_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'O destinatário é obrigatório para processos de expedição',
      path: ['destinatario_id'],
    });
  }
  if (['PERDA', 'EXPEDICAO', 'MORTALIDADE'].includes(dados.tipo) && !dados.lote_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'O lote de origem deve ser informado para este tipo de movimentação',
      path: ['lote_id'],
    });
  }
});

const MovimentacaoResponseSchema = z.object({
  _id: objectIdSchema,
  especie_id: objectIdSchema,
  usuario_id: objectIdSchema,
  tipo: z.enum(TIPO_MOVIMENTACAO_ENUM),
  quantidade: z.number(),
  justificativa: z.string(),
  data_registro: z.string().datetime(),
  lote_id: objectIdSchema.nullable().optional(),
  destinatario_id: objectIdSchema.nullable().optional(),
  createdAt: z.string().datetime(),
}).strict();

export { MovimentacaoSchema, MovimentacaoResponseSchema };

const MovimentacaoSeedSchema = z.object({
  especie_id: z.any(),
  usuario_id: z.any(),
  tipo: z.enum(TIPO_MOVIMENTACAO_ENUM),
  quantidade: z.number(),
  justificativa: z.string(),
  data_registro: z.date(),
  lote_id: z.any().nullable(),
  destinatario_id: z.any().nullable(),
}).strict();

export { MovimentacaoSeedSchema };