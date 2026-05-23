import { z } from 'zod';
import { CATEGORIA_USUARIO_ENUM, STATUS_DESTINATARIO_ENUM, TIPO_PESSOA_ENUM } from "../../../../constants/destinatario.js";

export { DestinatarioIdSchema, DestinatarioQuerySchema } from './querys/Destinatarioqueryschema.js';

export const DestinatarioSchema = z.object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),

    tipo: z.enum(TIPO_PESSOA_ENUM, {
        errorMap: () => ({ message: `Tipo inválido. Use: ${TIPO_PESSOA_ENUM.join(', ')}` })
    }),

    email: z.string().email('E-mail inválido').toLowerCase(),

    telefone: z.string().optional(),

    categoria: z.enum(Object.values(CATEGORIA_USUARIO_ENUM), {
        errorMap: () => ({ message: `Categoria inválida. Use: ${Object.values(CATEGORIA_USUARIO_ENUM).join(', ')}` })
    }),

    documento: z.string().min(1, 'Documento é obrigatório'),

    responsavel: z.string().optional(),

    endereco: z.string().min(1, 'Endereço é obrigatório'),
});

export const DestinatarioUpdateSchema = DestinatarioSchema.partial();

export const DestinatarioResponseSchema = z.object({
    _id: z.string(),
    nome: z.string(),
    tipo: z.enum(TIPO_PESSOA_ENUM),
    email: z.string().email(),
    telefone: z.string().optional(),
    categoria: z.enum(Object.values(CATEGORIA_USUARIO_ENUM)),
    documento: z.string(),
    responsavel: z.string().optional(),
    endereco: z.string(),
    status: z.enum(Object.values(STATUS_DESTINATARIO_ENUM)),
    data_registro: z.string().datetime(),
    data_att: z.string().datetime(),
}).strict();