import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { STATUS_ESTUFA_ENUM, STATUS_ESTUFA } from "../constants/estufa.js";

class Estufa {
  constructor() {
    const schema = new mongoose.Schema(
      {
        codigo_identificador: { 
          type: String, 
          required: true, 
          unique: true 
        },

        localizacao_estufa: { 
          type: String, 
          required: true 
        },
        localizacao_barraca: { 
          type: String, 
          required: true 
        },
        localizacao_posicao: { 
          type: String, 
          required: true 
        },

        capacidade_total: { 
          type: Number, 
          required: true 
        },

        status: {
          type: String,
          enum: STATUS_ESTUFA_ENUM,
          default: STATUS_ESTUFA.Livre,
          required: true
        }
      },
      {

        timestamps: {
          createdAt: 'data_registro',
          updatedAt: 'data_att'
        },
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
      }
    );

    schema.plugin(mongoosePaginate);

    this.model = mongoose.model("estufas", schema);
  }
}

export default new Estufa().model;