import { CustomError, messages } from '../utils/helpers/index.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../constants/auditoria.js';
import { STATUS_DESTINATARIO } from '../constants/destinatario.js';

class DestinatarioService {
    constructor({ destinatarioRepository, auditoriaService }) {
        this.repository = destinatarioRepository;
        this.auditoriaService = auditoriaService;
    }

    async listar({ filtros = {}, page = 1, limit = 10 }) {
        return this.repository.listar({ filtros, page: Number(page), limit: Number(limit) });
    }

    async buscarPorId(id) {
        return this.ensureExists(id);
    }

    async criar(dados, actor) {
        await this.ensureEmailUnico(dados.email);
        await this.ensureDocumentoUnico(dados.documento);

        const novoDestinatario = await this.repository.criar({
            ...dados,
            status: STATUS_DESTINATARIO.Ativo,
        });

        await this.auditoriaService.registrar({
            usuarioId: actor?.id,
            acao: AUDITORIA_ACOES.CRIAR_DESTINATARIO,
            entidade: AUDITORIA_ENTIDADES.DESTINATARIO,
            entidadeId: novoDestinatario.id,
        });

        return novoDestinatario;
    }

    async atualizar(id, dados, actor) {
        const destinatarioAtual = await this.ensureExists(id);

        if (dados.email && dados.email !== destinatarioAtual.email) {
            await this.ensureEmailUnico(dados.email);
        }

        if (dados.documento && dados.documento !== destinatarioAtual.documento) {
            await this.ensureDocumentoUnico(dados.documento);
        }

        const destinatarioAtualizado = await this.repository.atualizar(id, dados);

        await this.auditoriaService.registrar({
            usuarioId: actor?.id,
            acao: AUDITORIA_ACOES.ATUALIZAR_DESTINATARIO,
            entidade: AUDITORIA_ENTIDADES.DESTINATARIO,
            entidadeId: id,
        });

        return destinatarioAtualizado;
    }

    async inativar(id, actor) {
        await this.ensureExists(id);

        const destinatarioInativado = await this.repository.atualizar(id, {
            status: STATUS_DESTINATARIO.Inativo
        });

        await this.auditoriaService.registrar({
            usuarioId: actor?.id,
            acao: AUDITORIA_ACOES.INATIVAR_DESTINATARIO,
            entidade: AUDITORIA_ENTIDADES.DESTINATARIO,
            entidadeId: id,
        });

        return destinatarioInativado;
    }

    async ensureExists(id) {
        const destinatario = await this.repository.buscarPorId(id);
        if (!destinatario) {
            throw new CustomError({ statusCode: 404, customMessage: messages.error.resourceNotFound('Destinatário') });
        }
        return destinatario;
    }

    async ensureEmailUnico(email) {
        const existente = await this.repository.buscarPorEmail(email);
        if (existente) {
            throw new CustomError({ statusCode: 400, customMessage: `Já existe um destinatário cadastrado com o e-mail ${email}.` });
        }
    }

    async ensureDocumentoUnico(documento) {
        const existente = await this.repository.buscarPorDocumento(documento);
        if (existente) {
            throw new CustomError({ statusCode: 400, customMessage: `Já existe um destinatário cadastrado com o documento ${documento}.` });
        }
    }
}

export default DestinatarioService;