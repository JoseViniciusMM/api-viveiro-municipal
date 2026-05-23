import { CustomError, messages } from '../utils/helpers/index.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../constants/auditoria.js';
import { STATUS_USUARIO } from '../constants/usuario.js';

class UsuarioService {
    constructor({ usuarioRepository, passwordHasher, auditoriaService, tokenService, mailService }) {
        this.repository = usuarioRepository;
        this.passwordHasher = passwordHasher;
        this.auditoriaService = auditoriaService;
        this.tokenService = tokenService;
        this.mailService = mailService;
    }

    async listar({ filtros = {}, page = 1, limit = 15 }) {
        return this.repository.listar({ filtros, page: Number(page), limit: Number(limit) });
    }

    async buscarPorId(id) {
        return await this.ensureExists(id);
    }

    async criar(dados, actor) {
        await this.ensureCpfUnico(dados.cpf);
        await this.ensureEmailUnico(dados.email);

        if (dados.senha) {
            dados.senha = await this.passwordHasher.hashPassword(dados.senha);
            dados.status = STATUS_USUARIO.Ativo;
        } else {
            const tempPass = Math.random().toString(36).slice(2) + 'V1v@';
            dados.senha = await this.passwordHasher.hashPassword(tempPass);
            dados.status = STATUS_USUARIO.Pendente;
        }

        const usuario = await this.repository.criar(dados);

        if (dados.status === STATUS_USUARIO.Pendente && this.tokenService && this.mailService) {
            try {
                const token = this.tokenService.generatePasswordRecoveryToken(usuario._id);
                await this.repository.atualizar(usuario._id, {
                    token_ativacao: token,
                    token_ativacao_expira: new Date(Date.now() + 48 * 60 * 60 * 1000),
                });
                await this.mailService.enviarEmailBoasVindas(usuario.email, { token, nome: usuario.nome });
            } catch (emailErr) {
                console.warn('[PAMINE] Falha ao enviar e-mail de boas-vindas:', emailErr.message);
            }
        }

        await this.auditoriaService.registrar({
            usuario_id: actor?.id || actor?._id || usuario._id,
            acao: AUDITORIA_ACOES.CRIAR_USUARIO,
            detalhes_mudanca: {
                entidade: AUDITORIA_ENTIDADES.USUARIO,
                entidade_id: usuario._id,
            }
        });

        return usuario;
    }

    async atualizar(id, dados, actor) {
        await this.ensureExists(id);

        if (dados.senha) {
            dados.senha = await this.passwordHasher.hashPassword(dados.senha);
        }

        delete dados.cpf;

        const usuario = await this.repository.atualizar(id, dados);

        await this.auditoriaService.registrar({
            usuario_id: actor?.id || actor?._id || id,
            acao: AUDITORIA_ACOES.ATUALIZAR_USUARIO,
            detalhes_mudanca: {
                entidade: AUDITORIA_ENTIDADES.USUARIO,
                entidade_id: id,
            }
        });

        return usuario;
    }

    async inativar(id, actor) {
        await this.ensureExists(id);

        const usuario = await this.repository.atualizar(id, { status: STATUS_USUARIO.Inativo });

        await this.auditoriaService.registrar({
            usuario_id: actor?.id || actor?._id || id,
            acao: AUDITORIA_ACOES.INATIVAR_USUARIO,
            detalhes_mudanca: {
                entidade: AUDITORIA_ENTIDADES.USUARIO,
                entidade_id: id,
            }
        });

        return usuario;
    }

    async confirmarCadastro(token, senha) {
        const usuario = await this.repository.buscarPorTokenAtivacao(token);

        if (!usuario) {
            throw new CustomError({ statusCode: 400, customMessage: 'Token de ativação inválido.' });
        }

        if (new Date() > usuario.token_ativacao_expira) {
            throw new CustomError({ statusCode: 400, customMessage: 'Token expirado. Solicite um novo convite.' });
        }

        const senhaHash = await this.passwordHasher.hashPassword(senha);

        const atualizado = await this.repository.atualizar(usuario._id, {
            senha: senhaHash,
            status: STATUS_USUARIO.Ativo,
            token_ativacao: null,
            token_ativacao_expira: null,
        });

        await this.auditoriaService.registrar({
            usuario_id: usuario._id,
            acao: AUDITORIA_ACOES.ATIVAR_CONTA,
            detalhes_mudanca: {
                entidade: AUDITORIA_ENTIDADES.USUARIO,
                entidade_id: usuario._id,
            }
        });

        return atualizado;
    }

    async atualizarPerfil(id, dados, actor) {
        const usuario = await this.ensureExists(id);

        if (dados.email && dados.email !== usuario.email) {
            await this.ensureEmailUnico(dados.email);
        }

        if (dados.senha) {
            dados.senha = await this.passwordHasher.hashPassword(dados.senha);
        }

        delete dados.cargo;
        delete dados.status;

        const atualizado = await this.repository.atualizar(id, dados);

        await this.auditoriaService.registrar({
            usuario_id: actor?.id || actor?._id || id,
            acao: AUDITORIA_ACOES.ATUALIZAR_USUARIO,
            detalhes_mudanca: {
                entidade: AUDITORIA_ENTIDADES.USUARIO,
                entidade_id: id,
            }
        });

        return atualizado;
    }

    async ensureEmailUnico(email) {
        const existente = await this.repository.buscarPorEmail(email);
        if (existente) throw new CustomError({ statusCode: 400, customMessage: 'Email já está em uso' });
    }

    async ensureCpfUnico(cpf) {
        const existente = await this.repository.buscarPorCpf(cpf);
        if (existente) throw new CustomError({ statusCode: 400, customMessage: 'CPF já cadastrado no sistema' });
    }

    async ensureExists(id) {
        const usuario = await this.repository.buscarPorId(id);
        if (!usuario) {
            throw new CustomError({ statusCode: 404, customMessage: messages.error.resourceNotFound('Usuário') });
        }
        return usuario;
    }
}

export default UsuarioService;