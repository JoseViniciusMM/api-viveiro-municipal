import { z } from 'zod';
import { TIPO_PESSOA_ENUM, CATEGORIA_USUARIO_ENUM, STATUS_DESTINATARIO_ENUM } from '../../../../../constants/destinatario.js';

export const DestinatarioIdSchema = z.string().refine(
    (id) => /^[a-f\d]{24}$/i.test(id),
    { message: 'ID inválido' }
);

export const DestinatarioQuerySchema = z.object({
    page:      z.coerce.number().int().positive().default(1),
    limite:    z.coerce.number().int().positive().max(100).default(10),
    nome:      z.string().optional(),
    email:     z.string().optional(),
    documento: z.string().optional(),
    tipo:      z.enum(TIPO_PESSOA_ENUM).optional(),
    categoria: z.enum(Object.values(CATEGORIA_USUARIO_ENUM)).optional(),
    status:    z.enum(Object.values(STATUS_DESTINATARIO_ENUM)).optional(),
}).strict();