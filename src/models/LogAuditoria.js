import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


class LogAuditoria {
    constructor() {
        const schema = new mongoose.Schema(
            {
                usuario_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "usuarios",
                    required: true,
                    index: true,
                },
                acao: {
                    type: String,
                    required: true,
                },
                detalhes_mudanca: {
                    type: Object,
                    default: {},
                },

            },
            {
                versionKey: false,
                timestamps: {
                    createdAt: 'data_registro',
                }
            }
        );

        schema.index({ usuario_id: 1, data_registro: -1 });

        schema.plugin(mongoosePaginate);

        this.model = mongoose.model("logs_auditoria", schema);

    }
}

export default new LogAuditoria().model;