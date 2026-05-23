class MovimentacaoFilterBuilder {
    constructor() {
        this.filtros = {};
    }

    comTipo(tipo) {
        if (tipo) this.filtros.tipo = tipo;
        return this;
    }

    comEspecie(especieId) {
        if (especieId) this.filtros.especie_id = especieId;
        return this;
    }

    comUsuario(usuarioId) {
        if (usuarioId) this.filtros.usuario_id = usuarioId;
        return this;
    }

    comLote(loteId) {
        if (loteId) this.filtros.lote_id = loteId;
        return this;
    }

    comDestinatario(destinatarioId) {
        if (destinatarioId) this.filtros.destinatario_id = destinatarioId;
        return this;
    }

    comPeriodo(dataInicio, dataFim) {
        if (dataInicio && dataFim) {
            this.filtros.data_registro = {
                $gte: new Date(dataInicio),
                $lte: new Date(dataFim)
            };
        }
        return this;
    }

    build() {
        return this.filtros;
    }
}

export default MovimentacaoFilterBuilder;
