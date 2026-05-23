import { CustomError, messages } from '../utils/helpers/index.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../constants/auditoria.js';
import { STATUS_ESTUFA } from '../constants/estufa.js';

class EstufaService {
    constructor({ estufaRepository, auditoriaService, loteRepository }) {
        this.repository = estufaRepository;
        this.auditoriaService = auditoriaService;
        this.loteRepository = loteRepository;
    }

    async listar({ filtros = {}, page = 1, limit = 10 }) {
        return this.repository.listar({ filtros, page: Number(page), limit: Number(limit) });
    }

    async buscarPorId(id) {
        const estufa = await this.ensureExists(id);
        return estufa;
    }

    async criar(dados, actor) {
        this.validarCamposObrigatorios(dados);

        const codigoGerado = this.gerarCodigoIdentificador(dados);
        await this.ensureCodigoUnico(codigoGerado);

        const novaEstufa = await this.repository.criar({
            ...dados,
            codigo_identificador: codigoGerado,
            status: STATUS_ESTUFA.Livre,
            usuario_id: actor?.id
        });

        await this.auditoriaService.registrar({
            usuarioId: actor?.id,
            acao: AUDITORIA_ACOES.CRIAR_ESTUFA,
            entidade: AUDITORIA_ENTIDADES.ESTUFA,
            entidadeId: novaEstufa.id,
        });

        return novaEstufa;
    }

    async atualizar(id, dados, actor) {
        const estufaAtual = await this.ensureExists(id);

        if (dados.localizacao_estufa || dados.localizacao_barraca || dados.localizacao_posicao) {
            const novasLoc = {
                localizacao_estufa: dados.localizacao_estufa || estufaAtual.localizacao_estufa,
                localizacao_barraca: dados.localizacao_barraca || estufaAtual.localizacao_barraca,
                localizacao_posicao: dados.localizacao_posicao || estufaAtual.localizacao_posicao
            };
            dados.codigo_identificador = this.gerarCodigoIdentificador(novasLoc);

            if (dados.codigo_identificador !== estufaAtual.codigo_identificador) {
                await this.ensureCodigoUnico(dados.codigo_identificador);
            }
        }

        if (dados.capacidade_total) {
            const lotesNaEstufa = await this.loteRepository.buscarAtivosPorEstufa(id);
            const ocupacaoAtual = lotesNaEstufa.reduce((total, lote) => {
                return total + lote.itens_especies.reduce((sub, item) => sub + item.quantidade_atual, 0);
            }, 0);
            if (dados.capacidade_total < ocupacaoAtual) {
                throw new CustomError({ statusCode: 400, customMessage: "A nova capacidade é inferior à quantidade de mudas atual." });
            }
        }

        const estufaAtualizada = await this.repository.atualizar(id, dados);

        await this.auditoriaService.registrar({
            usuarioId: actor?.id,
            acao: AUDITORIA_ACOES.ATUALIZAR_ESTUFA,
            entidade: AUDITORIA_ENTIDADES.ESTUFA,
            entidadeId: id,
        });

        return estufaAtualizada;
    }

    async inativar(id, actor) {
        const estufa = await this.ensureExists(id);

        const lotesNaEstufa = await this.loteRepository.buscarAtivosPorEstufa(id);
        if (lotesNaEstufa && lotesNaEstufa.length > 0) {
            throw new CustomError({ statusCode: 400, customMessage: "Não é permitido inativar uma estufa que possua lotes ativos." });
        }

        const estufaInativada = await this.repository.atualizar(id, { status: STATUS_ESTUFA.Inativo });

        await this.auditoriaService.registrar({
            usuarioId: actor?.id,
            acao: AUDITORIA_ACOES.INATIVAR_ESTUFA,
            entidade: AUDITORIA_ENTIDADES.ESTUFA,
            entidadeId: id,
        });

        return estufaInativada;
    }

    async ensureExists(id) {
        const estufa = await this.repository.buscarPorId(id);
        if (!estufa) {
            throw new CustomError({ statusCode: 404, customMessage: messages.error.resourceNotFound('Estufa') });
        }
        return estufa;
    }

    async ensureCodigoUnico(codigo) {
        const existente = await this.repository.buscarPorCodigo(codigo);
        if (existente) {
            throw new CustomError({ statusCode: 400, customMessage: `Já existe uma estufa registrada na posição ${codigo}` });
        }
    }

    gerarCodigoIdentificador({ localizacao_estufa, localizacao_barraca, localizacao_posicao }) {
        const e = String(localizacao_estufa).padStart(2, '0');
        const b = String(localizacao_barraca).padStart(2, '0');
        const p = String(localizacao_posicao).padStart(2, '0');
        return `E${e}-B${b}-${p}`;
    }

    validarCamposObrigatorios(d) {
        if (!d.localizacao_estufa || !d.localizacao_barraca || !d.localizacao_posicao || !d.capacidade_total) {
            throw new CustomError({ statusCode: 400, customMessage: "Localização completa e capacidade são campos obrigatórios." });
        }
    }
}

export default EstufaService;