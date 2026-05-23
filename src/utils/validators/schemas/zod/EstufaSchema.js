import { z } from 'zod';
import { STATUS_ESTUFA_ENUM } from '../../../../constants/estufa.js';

export { EstufaIdSchema, EstufaQuerySchema } from './querys/Estufaqueryschema.js';

export const EstufaSchema = z.object({
    localizacao_estufa: z.string().min(1, 'Localização da estufa é obrigatória'),
    localizacao_barraca: z.string().min(1, 'Localização da barraca é obrigatória'),
    localizacao_posicao: z.string().min(1, 'Localização da posição é obrigatória'),
    capacidade_total: z.number().int().positive('Capacidade total deve ser um número positivo'),
});

export const EstufaUpdateSchema = EstufaSchema.partial().extend({
    status: z.enum(STATUS_ESTUFA_ENUM, {
        errorMap: () => ({ message: `Status inválido. Use: ${STATUS_ESTUFA_ENUM.join(', ')}` })
    }).optional(),
});

export const EstufaResponseSchema = z.object({
    _id: z.string(),
    codigo_identificador: z.string(),
    localizacao_estufa: z.string(),
    localizacao_barraca: z.string(),
    localizacao_posicao: z.string(),
    capacidade_total: z.number(),
    quantidade_atual: z.number(),
    status: z.enum(STATUS_ESTUFA_ENUM),
    usuario_id: z.string().optional(),
    data_registro: z.string().datetime(),
    data_att: z.string().datetime(),
}).strict();