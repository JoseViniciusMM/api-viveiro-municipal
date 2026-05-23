import { z } from 'zod';
import mongoose from 'mongoose';

export const LoteIdSchema = z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: 'ID de lote inválido' }
);

export const LoteQuerySchema = z.object({
    busca: z.string().optional().transform((val) => val?.trim()),
    
    especieId: z.string()
        .optional()
        .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), 'ID de espécie inválido'),
    
    estufaId: z.string()
        .optional()
        .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), 'ID de estufa inválido'),
        
    fase: z.enum(['Semeadura', 'Germinação', 'Produção', 'Pronto', 'Finalizado']).optional(),
    
    status: z.enum(['Ativo', 'Inativo']).optional(),

    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),

    page: z.string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => val > 0, 'Page deve ser maior que 0'),
        
    limite: z.string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 15))
        .refine((val) => val > 0 && val <= 100, 'Limite deve estar entre 1 e 100'),
});