// src/utils/validators/schemas/zod/querys/RelatorioQuerySchema.js

import { z } from 'zod';
import mongoose from 'mongoose';

export const RelatorioIdSchema = z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: 'ID inválido' }
);

export const RelatorioQuerySchema = z.object({
    especie_id: z
        .string()
        .optional()
        .refine(
            (id) => !id || mongoose.Types.ObjectId.isValid(id),
            { message: 'ID da espécie inválido' }
        ),
    estufa_id: z
        .string()
        .optional()
        .refine(
            (id) => !id || mongoose.Types.ObjectId.isValid(id),
            { message: 'ID da estufa inválido' }
        ),
    usuario_id: z
        .string()
        .optional()
        .refine(
            (id) => !id || mongoose.Types.ObjectId.isValid(id),
            { message: 'ID do usuário inválido' }
        ),
    fase: z
        .string()
        .optional()
        .refine((val) => !val || ['SEMEADURA', 'GERMINAÇÃO', 'PRODUÇÃO', 'PRONTO', 'FINALIZADO'].includes(val), {
            message: 'Fase deve ser SEMEADURA, GERMINAÇÃO, PRODUÇÃO, PRONTO ou FINALIZADO',
        }),
    tipo: z
        .string()
        .optional()
        .refine((val) => !val || ['ENTRADA', 'SAIDA', 'PERDA', 'EXPEDICAO', 'AJUSTE', 'ESTORNO'].includes(val), {
            message: 'Tipo deve ser ENTRADA, SAIDA, PERDA, EXPEDICAO, AJUSTE ou ESTORNO',
        }),
    data_inicio: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: 'Data de início deve ser uma data válida',
        }),
    data_fim: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: 'Data de fim deve ser uma data válida',
        }),
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => Number.isInteger(val) && val > 0, {
            message: 'Page deve ser um número inteiro maior que 0',
        }),
    limite: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
            message: 'Limite deve ser um número inteiro entre 1 e 100',
        }),
});