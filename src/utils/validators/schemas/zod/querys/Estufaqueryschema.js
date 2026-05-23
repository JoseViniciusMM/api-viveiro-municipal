import { z } from 'zod';

const STATUS_ESTUFA_ENUM = ['Livre', 'Ocupada', 'Inativo'];

export const EstufaIdSchema = z.string().refine(
    (id) => /^[a-f\d]{24}$/i.test(id),
    { message: 'ID inválido' }
);

export const EstufaQuerySchema = z.object({
    page:                 z.coerce.number().int().positive().default(1),
    limite:               z.coerce.number().int().positive().max(100).default(10),
    status:               z.enum(STATUS_ESTUFA_ENUM).optional(),
    codigo_identificador: z.string().optional(),
    localizacao_estufa:   z.string().optional(),
    localizacao_barraca:  z.string().optional(),
    localizacao_posicao:  z.string().optional(),
}).strict();