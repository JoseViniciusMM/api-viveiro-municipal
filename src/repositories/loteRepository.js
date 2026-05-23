import BaseRepository from './base/baseRepository.js';
import LoteModel from '../models/Lote.js';
import LoteFilterBuilder from './filters/LoteFilterBuilder.js';
import { STATUS } from '../constants/lote.js';

class LoteRepository extends BaseRepository {
    constructor() {
        super(LoteModel);
    }

    async buscarPorIdComDetalhes(id) {
        return this.model.findById(id)
        .populate('itens_especies.especie_id')
        .populate('estufa_id');
    }

    async buscarAtivosPorEstufa(estufaId) {
        return this.model.find({ 
            estufa_id: estufaId, 
            status: STATUS.Ativo 
        });
    }


    listar({ filtros = {}, page = 1, limit = 15 }) {
        const builder = new LoteFilterBuilder()
            .comBusca(filtros.busca)
            .comEspecie(filtros.especieId)
            .comEstufa(filtros.estufaId)
            .comFase(filtros.fase)
            .comStatus(filtros.status)
            .comPeriodo(filtros.dataInicio, filtros.dataFim);

        return this.listarComPaginacao(builder.build(), {
            page,
            limit,
            sort: { data_registro: -1 },
            populate: [
                { path: 'itens_especies.especie_id', select: 'nome_popular nome_cientifico' },
                { path: 'estufa_id', select: 'identificador capacidade_maxima' }
            ]
        });
    }
}

export default LoteRepository;