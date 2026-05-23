class EstufaFilterBuilder {
    constructor() {
        this.filtros = {};
    }

    comBusca(busca) {
        if (busca) {
            this.filtros.$or = [
                { codigo_identificador: { $regex: busca, $options: 'i' } },
                { localizacao_estufa: { $regex: busca, $options: 'i' } },
                { localizacao_barraca: { $regex: busca, $options: 'i' } },
                { localizacao_posicao: { $regex: busca, $options: 'i' } }
            ];
        }
        return this;
    }

    comLocalizacaoEstufa(localizacao) {
        if (localizacao) this.filtros.localizacao_estufa = { $regex: localizacao, $options: 'i' };
        return this;
    }

    comLocalizacaoBarraca(barraca) {
        if (barraca) this.filtros.localizacao_barraca = { $regex: barraca, $options: 'i' };
        return this;
    }

    comLocalizacaoPosicao(posicao) {
        if (posicao) this.filtros.localizacao_posicao = { $regex: posicao, $options: 'i' };
        return this;
    }

    comStatus(status) {
        if (status) this.filtros.status = status;
        return this;
    }

    comCapacidadeMinima(minima) {
        if (minima) this.filtros.capacidade_total = { $gte: Number(minima) };
        return this;
    }

    comCapacidadeMaxima(maxima) {
        if (maxima) this.filtros.capacidade_total = { ...this.filtros.capacidade_total, $lte: Number(maxima) };
        return this;
    }

    build() {
        return this.filtros;
    }
}

export default EstufaFilterBuilder;