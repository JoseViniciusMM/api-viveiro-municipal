class DestinatarioFilterBuilder {
    constructor() {
        this.filtros = {};
    }

    comNome(nome) {
        if (nome) this.filtros.nome = { $regex: nome, $options: 'i' };
        return this;
    }

    comTipo(tipo) {
        if (tipo) this.filtros.tipo = tipo;
        return this;
    }

    comEmail(email) {
        if (email) this.filtros.email = { $regex: email, $options: 'i' };
        return this;
    }

    comCategoria(categoria) {
        if (categoria) this.filtros.categoria = categoria;
        return this;
    }

    comDocumento(documento) {
        if (documento) this.filtros.documento = { $regex: documento, $options: 'i' };
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

export default DestinatarioFilterBuilder;