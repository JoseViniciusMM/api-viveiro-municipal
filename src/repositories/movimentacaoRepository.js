import BaseRepository from './base/baseRepository.js';
import MovimentacaoModel from '../models/Movimentacao.js';
import MovimentacaoFilterBuilder from './filters/movimentacaoFilterBuilder.js';

class MovimentacaoRepository extends BaseRepository {
    constructor() {
        super(MovimentacaoModel);
    }

    buscarPorLote(loteId) {
        return this.model.find({ lote_id: loteId });
    }

    buscarPorEspecie(especieId) {
        return this.model.find({ especie_id: especieId });
    }

    listar({ filtros = {}, page = 1, limit = 15 }) {
        const builder = new MovimentacaoFilterBuilder()
            .comTipo(filtros.tipo)
            .comEspecie(filtros.especieId)
            .comUsuario(filtros.usuarioId)
            .comLote(filtros.loteId)
            .comDestinatario(filtros.destinatarioId)
            .comPeriodo(filtros.dataInicio, filtros.dataFim);

        return this.listarComPaginacao(builder.build(), { page, limit });
    }
}

export default MovimentacaoRepository;