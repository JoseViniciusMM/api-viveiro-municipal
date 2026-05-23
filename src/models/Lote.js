import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { FASE_LOTE_ENUM, STATUS_ENUM } from "../constants/lote.js";

const itensEspecies = new mongoose.Schema({
  especie_id: { type: mongoose.Schema.Types.ObjectId, ref: "especies", required: true },
  quantidade_inicial: { type: Number, required: true },
  quantidade_atual: { type: Number, required: true }
});

class Lote {
  constructor() {
    const schema = new mongoose.Schema(
      {
        codigo: { type: String, required: true },

        itens_especies: [itensEspecies],

        fase: { 
          type: String,
          enum: FASE_LOTE_ENUM,
          required: true },

        status: {
          type: String,
          enum: STATUS_ENUM,
          required: true },

        estufa_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "estufas",
          default: null,
        },

        data_inicio: {
          type: Date,
          required: true,
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


    this.model = mongoose.model("lotes", schema);
  }
}

export default new Lote().model;
