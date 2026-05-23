import { z } from 'zod';
import mongoose from 'mongoose';
import objectIdSchema from './ObjectIdSchema.js';
import { FASE_LOTE_ENUM, STATUS_ENUM } from '../../../../constants/lote.js';

export { LoteIdSchema, LoteQuerySchema } from './querys/LoteQuerySchema.js';

export const LoteCriacaoSchema = z.object({
    estufa_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), 'ID da estufa é obrigatório'),
    itens_especies: z.array(
        z.object({
            especie_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), 'ID da espécie inválido'),
            quantidade_inicial: z.number().int().positive('A quantidade inicial deve ser positiva')
        })
    ).min(1, 'O lote deve conter pelo menos uma espécie')
});

export const LoteAtualizacaoFaseSchema = z.object({
    fase: z.enum(FASE_LOTE_ENUM, {
        errorMap: () => ({ message: `Fase inválida. Use: ${FASE_LOTE_ENUM.join(', ')}` })
    })
});

export const LoteMortalidadeSchema = z.object({
    especie_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), 'ID da espécie inválido'),
    quantidade: z.number().int().positive('A quantidade deve ser maior que zero'),
    justificativa: z.string().min(5, 'Justificativa obrigatória')
});

export const LoteTransferenciaSchema = z.object({
    nova_estufa_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), 'ID da estufa inválido')
});

export const LoteDelecaoSchema = z.object({
    justificativa: z.string().min(5, 'Justificativa de descarte obrigatória')
});

export const LoteResponseSchema = z.object({
    _id: objectIdSchema,
    codigo: z.string(),
    itens_especies: z.array(z.object({
        especie_id: objectIdSchema,
        quantidade_inicial: z.number(),
        quantidade_atual: z.number()
    })),
    fase: z.enum(FASE_LOTE_ENUM),
    status: z.enum(STATUS_ENUM),
    estufa_id: objectIdSchema.nullable().optional(),
    data_inicio: z.string().datetime(),
    data_registro: z.string().datetime(),
    data_att: z.string().datetime()
}).strict();

export const LoteSeedSchema = z.object({
    codigo: z.string(),
    itens_especies: z.array(z.object({
        especie_id: z.any(),
        quantidade_inicial: z.number(),
        quantidade_atual: z.number()
    })),
    fase: z.enum(FASE_LOTE_ENUM),
    status: z.enum(STATUS_ENUM),
    estufa_id: z.any().nullable(),
    data_inicio: z.date()
}).strict();
