import { z } from 'zod';
import { TIPO_USUARIO_ENUM, STATUS_USUARIO_ENUM } from '../../../../constants/usuario.js';
import objectIdSchema from './ObjectIdSchema.js';
export { UsuarioIdSchema, UsuarioQuerySchema } from './querys/UsuarioQuerySchema.js';

const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const UsuarioSchema = z.object({
    nome: z.string().min(1, 'Campo nome é obrigatório.'),
    cpf: z.string().min(11).max(14).regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'Formato de CPF inválido.'),
    email: z.string().email('Formato de email inválido.'),
    telefone: z.string().optional(),
    cargo: z.enum(TIPO_USUARIO_ENUM, {
        errorMap: () => ({ message: `Cargo deve ser um de: ${TIPO_USUARIO_ENUM.join(', ')}` }),
    }),
    senha: z.string().min(8).refine((s) => senhaRegex.test(s), {
        message: 'A senha deve conter pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.',
    }).optional(),
});

export const UsuarioUpdateSchema = z.object({
    nome: z.string().min(1).optional(),
    email: z.string().email('Formato de email inválido.').optional(),
    telefone: z.string().optional(),
    cargo: z.enum(TIPO_USUARIO_ENUM, {
        errorMap: () => ({ message: `Cargo deve ser um de: ${TIPO_USUARIO_ENUM.join(', ')}` }),
    }).optional(),
    status: z.enum(STATUS_USUARIO_ENUM, {
        errorMap: () => ({ message: `Status deve ser um de: ${STATUS_USUARIO_ENUM.join(', ')}` }),
    }).optional(),
    senha: z.string().min(8).refine((s) => senhaRegex.test(s), {
        message: 'A senha deve conter pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.',
    }).optional(),
});

export const ConfirmarCadastroSchema = z.object({
    token: z.string().min(1, 'Token é obrigatório.'),
    senha: z.string().min(8).refine((s) => senhaRegex.test(s), {
        message: 'A senha deve conter pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.',
    }),
});

export const AtualizarPerfilSchema = z.object({
    nome: z.string().min(1).optional(),
    email: z.string().email().optional(),
    telefone: z.string().optional(),
    senha: z.string().min(8).refine((s) => senhaRegex.test(s), {
        message: 'A senha deve conter pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.',
    }).optional(),
});

export const EsqueceuSenhaSchema = z.object({
    email: z.string().email('Formato de email inválido.'),
});

export const UsuarioResponseSchema = z.object({
    _id: objectIdSchema,
    nome: z.string(),
    cpf: z.string(),
    email: z.string().email(),
    telefone: z.string().nullable().optional(),
    cargo: z.enum(TIPO_USUARIO_ENUM),
    status: z.enum(STATUS_USUARIO_ENUM),
    data_registro: z.string().datetime(),
    data_att: z.string().datetime(),
});