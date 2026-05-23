// src/repositories/LogAuditoriaRepository.js

import BaseRepository from './base/baseRepository.js';
import LogAuditoriaModel from '../models/LogAuditoria.js';
import LogAuditoriaFilterBuilder from './filters/LogAuditoriaFilterBuilder.js';

class LogAuditoriaRepository extends BaseRepository {
  constructor() {
    super(LogAuditoriaModel);
  }

  listar({ filtros = {}, page = 1, limit = 20 }) {
    const builder = new LogAuditoriaFilterBuilder()
      .comUsuario(filtros.usuario_id)
      .comAcao(filtros.acao)
      .comPeriodo(filtros.data_inicio, filtros.data_fim);

    return this.listarComPaginacao(builder.build(), {
      page,
      limit,
      sort: { data_registro: -1 },
      populate: { path: 'usuario_id', select: 'nome' }
    });
  }

  registrar(dados) {
    return this.criar(dados);
  }
}

export default LogAuditoriaRepository;