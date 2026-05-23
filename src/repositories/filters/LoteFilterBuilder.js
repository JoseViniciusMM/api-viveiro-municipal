class LoteFilterBuilder {
    constructor() {
        this.filtros = {};
    }

    comBusca(busca) {
        if (busca) {
            this.filtros.$or = [
                { codigo: { $regex: busca, $options: 'i' } }
            ];
        }
        return this;
    }

    comEspecie(especieId) {
        if (especieId) this.filtros['itens_especies.especie_id'] = especieId;
        return this;
    }

    comEstufa(estufaId) {
        if (estufaId) this.filtros.estufa_id = estufaId;
        return this;
    }

    comFase(fase) {
        if (fase) this.filtros.fase = fase;
        return this;
    }

    comStatus(status) {
        if (status) this.filtros.status = status;
        return this;
    }

    comPeriodo(dataInicio, dataFim) {
        if (dataInicio && dataFim) {
            this.filtros.data_inicio = {
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

export default LoteFilterBuilder;