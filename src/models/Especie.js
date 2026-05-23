import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { STATUS_ESPECIE_ENUM, TIPO_ESPECIE_ENUM } from "../constants/especie.js"; 

class Especie {
  constructor() {
    const schema = new mongoose.Schema(
      {
        nome_cientifico: { 
          type: String,
          required: false,
          default: null,
          trim: true,
        },
        nome_popular: {
          type: String,
          trim: true,
          required: true,
        },
        variedade: {
          type: String,
          default: null,
        },
        tipo: {
          type: String,
          enum: TIPO_ESPECIE_ENUM, 
          required: true,
        },
        quantidade_atual: {
          type: Number,
          default: 0,
          min: 0,
        },
        categoria: {
          type: String, 
          required: true,
        },
        status: {
          type: String,
          enum: STATUS_ESPECIE_ENUM, 
          default: "ATIVO",
        },
        anotacoes: { 
          type: String,
          default: "",
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
    
    this.model = mongoose.model("especies", schema);
  }
}

export default new Especie().model;