import BaseRepository from './base/baseRepository.js';
import EspecieModel from '../models/Especie.js';
import EspecieFilterBuilder from './filters/especieFilterBuilder.js';

class EspecieRepository extends BaseRepository {
    constructor() {
        super(EspecieModel);
    }

    buscarPorNomeCientifico(nomeCientifico) {
        return this.model.findOne({ nome_cientifico: nomeCientifico });
    }

    listar({ filtros = {}, page = 1, limit = 10 }) {
        const builder = new EspecieFilterBuilder()
            .comNome(filtros.nome)
            .comCategoria(filtros.categoria)
            .comTipo(filtros.tipo)
            .comStatus(filtros.status);

        return this.listarComPaginacao(builder.build(), {
            page,
            limit,
            sort: { data_registro: -1 },
        });
    }
}

export default EspecieRepository;