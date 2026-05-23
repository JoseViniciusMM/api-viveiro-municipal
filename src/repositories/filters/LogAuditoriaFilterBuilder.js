// src/repositories/filters/LogAuditoriaFilterBuilder.js

class LogAuditoriaFilterBuilder {
  constructor() {
    this.filtro = {};
  }

  comUsuario(usuarioId) {
    if (usuarioId) this.filtro.usuario_id = usuarioId;
    return this;
  }

  comAcao(acao) {
    if (acao) this.filtro.acao = acao;
    return this;
  }

  comEntidade(entidade) {
    if (entidade) this.filtro.entidade = entidade;
    return this;
  }

  comEntidadeId(entidadeId) {
    if (entidadeId) this.filtro.entidade_id = entidadeId;
    return this;
  }

  comPeriodo(dataInicio, dataFim) {
    if (dataInicio || dataFim) {
      this.filtro.data_registro = {};
      if (dataInicio) this.filtro.data_registro.$gte = new Date(dataInicio);
      if (dataFim)    this.filtro.data_registro.$lte = new Date(dataFim);
    }
    return this;
  }

  build() {
    return this.filtro;
  }
}

export default LogAuditoriaFilterBuilder;