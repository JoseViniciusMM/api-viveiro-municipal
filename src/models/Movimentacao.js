import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { TIPO_MOVIMENTACAO_ENUM } from "../constants/movimentacao.js";

class Movimentacao {
  constructor() {
    const schema = new mongoose.Schema(
      {
        tipo: { 
          type: String,
          enum: TIPO_MOVIMENTACAO_ENUM,
          required: true 
        },

        especie_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "especies",
          required: true,
        },

        lote_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "lotes",
          required: false, 
        },

        quantidade: {
          type: Number,
          required: true,
        },

        justificativa: {
          type: String,
          required: true,
        },

        usuario_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "usuarios",
          required: true,
        },

        destinatario_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "destinatarios",
          required: false,
        },

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


    this.model = mongoose.model("movimentacoes", schema);
  }
}

export default new Movimentacao().model;
