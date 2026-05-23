import { CustomError, messages } from '../utils/helpers/index.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../constants/auditoria.js';
import { STATUS_USUARIO } from '../constants/usuario.js';

class AuthService {
    constructor({ usuarioRepository, passwordHasher, auditoriaService, tokenService, sessionService }) {
        this.usuarioRepository = usuarioRepository;
        this.passwordHasher = passwordHasher;
        this.auditoriaService = auditoriaService;
        this.tokenService = tokenService;
        this.sessionService = sessionService;
    }

    async login(credentials) {
        const { cpf, email, senha } = credentials;

        if (!senha) {
            throw new CustomError({ statusCode: 400, customMessage: 'Senha é obrigatória.' });
        }

        let usuario;
        if (cpf) {
        usuario = await this.usuarioRepository.buscarPorCpfComSenha(cpf); 
        } else if (email) {
            usuario = await this.usuarioRepository.buscarPorEmailComSenha(email);

        } else {
            throw new CustomError({ statusCode: 400, customMessage: 'CPF ou Email é obrigatório.' });
        }

        if (!usuario) {
            throw new CustomError({ statusCode: 401, customMessage: messages.auth.authenticationFailed });
        }

        if (usuario.status === STATUS_USUARIO.Inativo) {
            throw new CustomError({ statusCode: 403, customMessage: 'Usuário desativado.' });
        }

        if (usuario.status === STATUS_USUARIO.Pendente) {
            throw new CustomError({ statusCode: 403, customMessage: 'Conta aguardando ativação.' });
        }

        const senhaValida = await this.passwordHasher.comparePassword(senha, usuario.senha);
        if (!senhaValida) {
            throw new CustomError({ statusCode: 401, customMessage: messages.auth.authenticationFailed });
        }

        const refreshToken = this.tokenService.generateRefreshToken(usuario._id);
        await this.usuarioRepository.atualizar(usuario._id, { refreshtoken: refreshToken });

        const accessTokenData = this.tokenService.generateAccessToken({ userId: usuario._id, papeis: [usuario.cargo] });

        await this.usuarioRepository.atualizar(usuario._id, { ultimoLoginEm: new Date() });

        await this.auditoriaService.registrar({
            usuarioId: usuario._id,
            acao: AUDITORIA_ACOES.LOGIN,
            entidade: AUDITORIA_ENTIDADES.USUARIO,
            entidadeId: usuario._id,
        });

        return {
            accessToken: accessTokenData.token,
            refreshToken,
            expiraEm: accessTokenData.expiraEm,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                cargo: usuario.cargo,
            },
        };
    }

    async logout(userId) {
        await this.sessionService.revoke(userId);

        await this.auditoriaService.registrar({
            usuarioId: userId,
            acao: AUDITORIA_ACOES.LOGOUT,
            entidade: AUDITORIA_ENTIDADES.USUARIO,
            entidadeId: userId,
        });
    }

    async refreshToken(refreshToken) {
        const decoded = this.tokenService.verifyRefreshToken(refreshToken);
        const usuario = await this.usuarioRepository.buscarPorIdComToken(decoded.id);

        if (!usuario || usuario.refreshtoken !== refreshToken || usuario.status !== STATUS_USUARIO.Ativo) {
            throw new CustomError({ statusCode: 401, customMessage: 'Token inválido.' });
        }

        const accessTokenData = this.tokenService.generateAccessToken({ userId: usuario._id, papeis: [usuario.cargo] });

        return { accessToken: accessTokenData.token, expiraEm: accessTokenData.expiraEm };
    }

    async esqueceuSenha(email) {
        const usuario = await this.usuarioRepository.buscarPorEmail(email);

        if (!usuario) return;

        try {
            if (this.mailService) {
                await this.mailService.enviarEmailRecuperacaoSenha(usuario.email, { nome: usuario.nome });
            }
        } catch (err) {
            console.warn('[PAMINE] Falha ao enviar e-mail de recuperação:', err.message);
        }

        await this.auditoriaService.registrar({
            usuarioId: usuario._id,
            acao: AUDITORIA_ACOES.RESETAR_SENHA,
            entidade: AUDITORIA_ENTIDADES.USUARIO,
            entidadeId: usuario._id,
        });
    }
}

export default AuthService;