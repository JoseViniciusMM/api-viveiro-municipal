import BaseRepository from './base/baseRepository.js';
import UsuarioModel from '../models/Usuario.js';
import UsuarioFilterBuilder from './filters/usuarioFilterBuilder.js';

class UsuarioRepository extends BaseRepository {
    constructor() {
        super(UsuarioModel);
    }

    buscarPorCpf(cpf) {
        return this.model.findOne({ cpf });
    }

    buscarPorEmail(email) {
        return this.model.findOne({ email });
    }

    buscarPorCpfComSenha(cpf) {
        return this.model.findOne({ cpf }).select('+senha');
    }

    buscarPorIdComToken(id) {
    return this.model.findById(id).select('+refreshtoken');
}

    buscarPorEmailComSenha(email) {
        return this.model.findOne({ email }).select('+senha');
    }

    buscarPorTokenAtivacao(token) {
        return this.model.findOne({ token_ativacao: token }).select('+token_ativacao +token_ativacao_expira');
    }

    // Soft Delete
    inativar(id) {
        return this.atualizar(id, { status: 'Inativo' });
    }

    // Metodo de listagem com filtro
    listar({ filtros = {}, page = 1, limit = 15 }) {
        const builder = new UsuarioFilterBuilder()
            .comNome(filtros.nome)
            .comCpf(filtros.cpf)
            .comCargo(filtros.cargo)
            .comStatus(filtros.status);

        // Usa o metodo da baserepository para paginação
        return this.listarComPaginacao(builder.build(), { page, limit });
    }

    removeToken(userId) {
        return this.atualizar(userId, { refreshtoken: null });
    }
}

export default UsuarioRepository;