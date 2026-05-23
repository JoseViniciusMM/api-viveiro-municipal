import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { TIPO_PESSOA_ENUM, CATEGORIA_USUARIO_ENUM, STATUS_DESTINATARIO_ENUM, STATUS_DESTINATARIO } from "../constants/destinatario.js";

class Destinatario {
    constructor() {
        const schema = new mongoose.Schema(
        {
        nome: {
            type: String,
            required: true,
        },

        tipo: {
            type: String,
            enum: TIPO_PESSOA_ENUM,
            required: true,
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
        
        categoria: {
            type: String,
            enum: CATEGORIA_USUARIO_ENUM,
            required: true,
        },
   
        documento: {
            type: String,
            required: true,
            unique: true,
        },

        responsavel: {
            type: String,
            required: false,
        },

        endereco: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: STATUS_DESTINATARIO_ENUM,
            default: STATUS_DESTINATARIO.Ativo,
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

        this.model = mongoose.model("destinatario", schema);
    }
}

export default new Destinatario().model;