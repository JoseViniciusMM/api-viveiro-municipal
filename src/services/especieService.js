import { CustomError, messages } from '../utils/helpers/index.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../constants/auditoria.js';
import { STATUS_ESPECIE } from '../constants/especie.js';
import { TIPO_MOVIMENTACAO } from '../constants/movimentacao.js';

class EspecieService {
  constructor({ especieRepository, auditoriaService, movimentacaoRepository, movimentacaoService }) {
    this.repository = especieRepository;
    this.auditoriaService = auditoriaService;
    this.movimentacaoRepository = movimentacaoRepository;
    this.movimentacaoService = movimentacaoService;
  }

  async criar(dados, usuarioId) {
    const quantidadeInicial = Number(dados.quantidade_inicial) || 0;

    const novaEspecie = await this.repository.criar({
      nome_popular: dados.nome_popular,
      nome_cientifico: dados.nome_cientifico || null,
      variedade: dados.variedade,
      categoria: dados.categoria,
      tipo: dados.tipo,
      quantidade_atual: 0,
      status: STATUS_ESPECIE.Ativo,
      data_registro: new Date(),
    });

    await this.auditoriaService.registrar({
      usuarioId,
      acao: AUDITORIA_ACOES.CRIAR_ESPECIE,
      entidade: AUDITORIA_ENTIDADES.ESPECIE,
      entidadeId: novaEspecie.id,
    });

    if (quantidadeInicial > 0) {
      await this.movimentacaoService.criar({
        especie_id: novaEspecie._id,
        tipo: TIPO_MOVIMENTACAO.Entrada,
        quantidade: quantidadeInicial,
        justificativa: "Saldo inicial de implantação da espécie no sistema"
      }, { id: usuarioId });
    }

    return this.buscarPorId(novaEspecie._id);
  }

  async listar({ filtros = {}, page = 1, limit = 10 }) {
    const query = {};

    if (filtros.categoria) query.categoria = filtros.categoria;
    if (filtros.tipo) query.tipo = filtros.tipo;
    if (filtros.status) query.status = filtros.status;

    return this.repository.listar({ filtros: query, page: Number(page), limit: Number(limit) });
  }

  async listarTodas(params) {
    return this.listar(params);
  }

  async buscarPorId(id) {
    const especie = await this.repository.buscarPorId(id);
    if (!especie) {
      throw new CustomError({
        statusCode: 404,
        customMessage: messages.error.resourceNotFound('Espécie'),
      });
    }
    return especie;
  }

  async obterHistorico(id, page = 1, limit = 50) {
    await this.buscarPorId(id);

    return this.movimentacaoRepository.listar({
      filtros: { especie_id: id },
      page: Number(page),
      limit: Number(limit),
    });
  }

  async atualizar(id, dados, usuarioId) {
    await this.buscarPorId(id);

    delete dados.quantidade_atual;
    delete dados.tipo;

    const especieAtualizada = await this.repository.atualizar(id, {
      ...dados,
      data_att: new Date(),
    });

    await this.auditoriaService.registrar({
      usuarioId,
      acao: AUDITORIA_ACOES.ATUALIZAR_ESPECIE,
      entidade: AUDITORIA_ENTIDADES.ESPECIE,
      entidadeId: id,
    });

    return especieAtualizada;
  }
}

export default EspecieService;