import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { TIPO_USUARIO_ENUM, STATUS_USUARIO_ENUM, STATUS_USUARIO } from '../constants/usuario.js';

class Usuario {
    constructor() {
        const schema = new mongoose.Schema(
        {
        nome: {
            type: String,
            required: true,
        },

        cpf: {
            type: String,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        telefone: {
            type: String,
            required: false,
        },
        
        cargo: {
            type: String,
            enum: TIPO_USUARIO_ENUM,
            required: true,
        },
   
        senha: {
            type: String,
            required: false, 
            select: false,
        },
        status: {
            type: String,
            enum: STATUS_USUARIO_ENUM,
            default: STATUS_USUARIO.Pendente,
        },

        token_ativacao: {
            type: String,
            required: false,
            select: false,
        },
        token_ativacao_expira: {
            type: Date,
            required: false,
            select: false,
        },

        token_reset_senha: {
            type: String,
            required: false,
            select: false,
        },

        token_reset_expira: {
            type: Date,
            required: false,
            select: false,
        },

        refreshtoken: {
            type: String,
            required: false,
            select: false,
        }
    },
            {
                timestamps: {
                    createdAt: 'data_registro',
                    updatedAt: 'data_att'
                },
                versionKey: false,
            }
        );

        schema.plugin(mongoosePaginate);

        this.model = mongoose.model('usuarios', schema);
    }
}

export default new Usuario().model;