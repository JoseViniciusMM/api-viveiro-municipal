import { TIPO_MOVIMENTACAO } from '../constants/movimentacao.js';

class RelatorioService {
  constructor({ loteRepository, movimentacaoRepository, especieRepository, estufaRepository, usuarioRepository, destinatarioRepository, logAuditoriaRepository }) {
    this.loteRepository = loteRepository;
    this.movimentacaoRepository = movimentacaoRepository;
    this.especieRepository = especieRepository;
    this.estufaRepository = estufaRepository;
    this.usuarioRepository = usuarioRepository;
    this.destinatarioRepository = destinatarioRepository;
    this.logAuditoriaRepository = logAuditoriaRepository;
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

  async listarEspecies({ filtros = {}, page = 1, limit = 20 }) {
    return this.especieRepository.listar({ filtros, page, limit });
  }

  async listarEstufas({ filtros = {}, page = 1, limit = 20 }) {
    return this.estufaRepository.listar({ filtros, page, limit });
  }

  async listarUsuarios({ filtros = {}, page = 1, limit = 20 }) {
    return this.usuarioRepository.listar({ filtros, page, limit });
  }

  async listarDestinatarios({ filtros = {}, page = 1, limit = 20 }) {
    return this.destinatarioRepository.listar({ filtros, page, limit });
  }

  async listarAuditoria({ filtros = {}, page = 1, limit = 20 }) {
    return this.logAuditoriaRepository.listar({ filtros, page, limit });
  }
}

export default RelatorioService;