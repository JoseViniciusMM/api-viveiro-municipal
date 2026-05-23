class SessionService {
    constructor({ usuarioRepository }) {
        this.usuarioRepository = usuarioRepository;
    }

    async revoke(userId) {
        return this.usuarioRepository.removeToken(userId);
    }

    async verificarSessaoAtiva(userId) {
        const usuario = await this.usuarioRepository.buscarPorIdComToken(userId);
        return !!usuario?.refreshtoken;
    }
}

export default SessionService;