import EstufaFilterBuilder from "./filters/estufaFilterBuilder.js";
import BaseRepository from './base/baseRepository.js';
import EstufaModel from '../models/Estufa.js';

class EstufaRepository extends BaseRepository {
    constructor() {
        super(EstufaModel);
    }
    
    buscarPorCodigo(codigo_identificador) {
        return this.model.findOne({ codigo_identificador });
    }
    
    listar({ filtros = {}, page = 1, limit = 10 }) {
        const builder = new EstufaFilterBuilder()
            .comBusca(filtros.busca)
            .comLocalizacaoEstufa(filtros.localizacao_estufa)
            .comLocalizacaoBarraca(filtros.localizacao_barraca)
            .comLocalizacaoPosicao(filtros.localizacao_posicao)
            .comStatus(filtros.status)
            .comCapacidadeMinima(filtros.capacidade_minima)
            .comCapacidadeMaxima(filtros.capacidade_maxima);

        return this.model.paginate(builder.build(), { page, limit, lean: true });
    }

}

export default EstufaRepository;