class EspecieFilterBuilder {
    constructor() {
        this.filtros = {};
    }

    comNome(nome) {
        if (nome) this.filtros.nome_cientifico = { $regex: nome, $options: 'i' };
        return this;
    }

    comCategoria(categoria) {
        if (categoria) this.filtros.categoria = categoria;
        return this;
    }

    comTipo(tipo) {
        if (tipo) this.filtros.tipo = tipo;
        return this;
    }

    comStatus(status) {
        if (status) this.filtros.status = status;
        return this;
    }

    build() {
        return this.filtros;
    }
}

export default EspecieFilterBuilder;