import DestinatarioFilterBuilder from "./filters/destinatarioFilterBuilder.js";
import BaseRepository from './base/baseRepository.js';
import DestinatarioModel from '../models/Destinatario.js';

class DestinatarioRepository extends BaseRepository {
    constructor() {
        super(DestinatarioModel);
    }

    listar({ filtros = {}, page = 1, limit = 10 }) {
        const builder = new DestinatarioFilterBuilder()
            .comNome(filtros.nome)
            .comTipo(filtros.tipo)
            .comEmail(filtros.email)
            .comCategoria(filtros.categoria)
            .comDocumento(filtros.documento)
            .comStatus(filtros.status);

        return this.model.paginate(builder.build(), { page, limit, lean: true });
    }

    buscarPorEmail(email) {
        return this.model.findOne({ email });
    }

    buscarPorDocumento(documento) {
        return this.model.findOne({ documento });
    }
}

export default DestinatarioRepository;