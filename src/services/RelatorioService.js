import { TIPO_MOVIMENTACAO } from '../constants/movimentacao.js';

class RelatorioService {
  constructor({ loteRepository, movimentacaoRepository }) {
    this.loteRepository = loteRepository;
    this.movimentacaoRepository = movimentacaoRepository;
  }

  async listarLotes({ filtros = {}, page = 1, limit = 20 }) {
    return this.loteRepository.listar({ filtros, page, limit });
  }

  async listarMovimentacoes({ filtros = {}, page = 1, limit = 20 }) {
    return this.movimentacaoRepository.listar({ filtros, page, limit });
  }

  async listarMortalidade({ filtros = {}, page = 1, limit = 20 }) {
    if (!filtros.data_inicio || !filtros.data_fim) {
      throw new Error('Filtro de data_inicio e data_fim é obrigatório.');
    }

    return this.movimentacaoRepository.listar({
      filtros: {
        ...filtros,
        tipo: TIPO_MOVIMENTACAO.Mortalidade,
      },
      page,
      limit,
    });
  }
}

export default RelatorioService;