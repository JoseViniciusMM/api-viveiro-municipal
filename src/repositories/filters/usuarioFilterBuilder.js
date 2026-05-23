class UsuarioFilterBuilder {
    constructor() {
        this.filtros = {};
    }

    comNome(nome) {
        if (nome) this.filtros.nome = { $regex: nome, $options: 'i' };
        return this;
    }

    comCpf(cpf) {
        if (cpf) this.filtros.cpf = { $regex: cpf, $options: 'i' };
        return this;
    }

    comCargo(cargo) {
        if (cargo) this.filtros.cargo = cargo;
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

export default UsuarioFilterBuilder;
