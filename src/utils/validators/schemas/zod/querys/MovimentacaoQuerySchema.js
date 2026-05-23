import { z } from 'zod';
import mongoose from 'mongoose';

export const MovimentacaoIdSchema = z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: 'ID de movimentação inválido' }
);

export const MovimentacaoQuerySchema = z.object({
    tipo: z
        .enum(['ENTRADA', 'SAIDA', 'AJUSTE', 'PERDA', 'EXPEDICAO', 'MORTALIDADE'])
        .optional(),
    especieId: z
        .string()
        .optional()
        .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), 'ID de espécie inválido'),
    usuarioId: z
        .string()
        .optional()
        .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), 'ID de usuário inválido'),
    loteId: z
        .string()
        .optional()
        .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), 'ID de lote inválido'),
    data_inicio: z.string().datetime().optional(),
    data_fim: z.string().datetime().optional(),
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => val > 0, 'Page deve ser maior que 0'),
    limite: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 15))
        .refine((val) => val > 0 && val <= 100, 'Limite deve estar entre 1 e 100'),
});