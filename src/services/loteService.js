import { CustomError } from '../utils/helpers/index.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../constants/auditoria.js';
import { FASE_LOTE, STATUS } from '../constants/lote.js';
import { TIPO_MOVIMENTACAO } from '../constants/movimentacao.js';
import { STATUS_ESTUFA } from '../constants/estufa.js';

class LoteService {
    constructor({ loteRepository, estufaRepository, movimentacaoService, auditoriaService, especieRepository }) {
        this.repository = loteRepository;
        this.estufaRepository = estufaRepository;
        this.movimentacaoService = movimentacaoService;
        this.auditoriaService = auditoriaService;
        this.especieRepository = especieRepository;
    }

    async listar(params) {
        return this.repository.listar(params);
    }

    async buscarHistorico(id) {
        await this.buscarPorId(id);

        const movimentacoes = await this.movimentacaoService.listar({
            filtros: { loteId: id },
            limit: 100 
        });

        const logsAuditoria = await this.auditoriaService.listar({
            filtros: {
                entidade: AUDITORIA_ENTIDADES.LOTE,
                entidade_id: id,
            },
            limit: 100,
        }, null, true);

        return {
            movimentacoes: movimentacoes.docs || movimentacoes,
            auditoria: logsAuditoria
        };
    }

    async buscarPorId(id) {
        const lote = await this.repository.buscarPorIdComDetalhes(id);
        if (!lote) {
            throw new CustomError({ statusCode: 404, customMessage: 'Lote não encontrado' });
        }
        return lote;
    }

    async criar(dados, usuario) {
        const { estufa_id, itens_especies } = dados;

        const estufa = await this.estufaRepository.buscarPorId(estufa_id);
        if (!estufa) throw new CustomError({ statusCode: 404, customMessage: 'Estufa não encontrada' });
        if (estufa.status === STATUS_ESTUFA.Manutencao) throw new CustomError({ statusCode: 400, customMessage: 'Estufa em manutenção' });

        let quantidadeTotalNovoLote = 0;
        const itensFormatados = [];

        for (const item of itens_especies) {
            const especie = await this.especieRepository.buscarPorId(item.especie_id);
            
            if (!especie) {
                throw new CustomError({ statusCode: 404, customMessage: `Espécie com ID ${item.especie_id} não encontrada na sementeira` });
            }
            if (especie.quantidade_atual < item.quantidade_inicial) {
                throw new CustomError({ statusCode: 400, customMessage: `Saldo insuficiente na sementeira para a espécie: ${especie.nome_popular}` });
            }

            quantidadeTotalNovoLote += item.quantidade_inicial;
            itensFormatados.push({
                especie_id: item.especie_id,
                quantidade_inicial: item.quantidade_inicial,
                quantidade_atual: item.quantidade_inicial
            });
        }

        const lotesNaEstufa = await this.repository.buscarAtivosPorEstufa(estufa_id);
        const ocupacaoAtual = lotesNaEstufa.reduce((total, lote) => {
            return total + lote.itens_especies.reduce((sub, item) => sub + item.quantidade_atual, 0);
        }, 0);

        if ((ocupacaoAtual + quantidadeTotalNovoLote) > estufa.capacidade_total) {
            throw new CustomError({ statusCode: 400, customMessage: 'Capacidade máxima da estufa excedida' });
        }

        const codigoLote = `LOTE-${Date.now()}`;
        const lote = await this.repository.criar({
            ...dados,
            codigo: codigoLote,
            itens_especies: itensFormatados,
            fase: FASE_LOTE.Semeadura,
            status: STATUS.Ativo,
            data_inicio: new Date()
        });

        const novaOcupacao = ocupacaoAtual + quantidadeTotalNovoLote;
        if (novaOcupacao >= estufa.capacidade_total) {
            await this.estufaRepository.atualizar(estufa_id, { status: STATUS_ESTUFA.Indisponivel });
        }

        for (const item of itensFormatados) {
            await this.movimentacaoService.criar({
                especie_id: item.especie_id,
                tipo: TIPO_MOVIMENTACAO.Saida,
                quantidade: item.quantidade_inicial,
                justificativa: `Alocação inicial para o ${codigoLote}`,
                lote_id: lote._id
            }, usuario);
        }

        await this.auditoriaService.registrar({
            usuarioId: usuario?.id,
            acao: AUDITORIA_ACOES.CRIAR_LOTE,
            entidade: AUDITORIA_ENTIDADES.LOTE,
            entidadeId: lote._id,
        });

        return lote;
    }

    async atualizarFase(id, fase, usuario) {
        const lote = await this.buscarPorId(id);
        if (lote.status !== STATUS.Ativo) throw new CustomError({ statusCode: 400, customMessage: 'Lote inativo ou finalizado' });

        const loteAtualizado = await this.repository.atualizar(id, { fase });

        if (fase === FASE_LOTE.Finalizado && loteAtualizado.estufa_id) {
            await this.estufaRepository.atualizar(loteAtualizado.estufa_id._id, { status: STATUS_ESTUFA.Livre });
        }

        await this.auditoriaService.registrar({
            usuarioId: usuario?.id,
            acao: AUDITORIA_ACOES.ATUALIZAR_FASE_LOTE,
            entidade: AUDITORIA_ENTIDADES.LOTE,
            entidadeId: id,
        });

        return loteAtualizado;
    }

    async registrarMortalidade(id, dadosMortalidade, usuario) {
        const { especie_id, quantidade, justificativa } = dadosMortalidade;
        
        const lote = await this.buscarPorId(id);
        if (lote.status !== STATUS.Ativo) throw new CustomError({ statusCode: 400, customMessage: 'Lote inativo ou finalizado' });

        await this.movimentacaoService.criar({
            especie_id,
            tipo: TIPO_MOVIMENTACAO.Mortalidade,
            quantidade,
            justificativa,
            lote_id: id
        }, usuario);

        return this.buscarPorId(id);
    }

    async transferir(id, nova_estufa_id, usuario) {
        const lote = await this.buscarPorId(id);
        if (lote.status !== STATUS.Ativo) throw new CustomError({ statusCode: 400, customMessage: 'Lote inativo ou finalizado' });
        if (lote.estufa_id._id.toString() === nova_estufa_id.toString()) throw new CustomError({ statusCode: 400, customMessage: 'Lote já está nesta estufa' });

        const novaEstufa = await this.estufaRepository.buscarPorId(nova_estufa_id);
        if (!novaEstufa || novaEstufa.status === STATUS_ESTUFA.Manutencao) throw new CustomError({ statusCode: 400, customMessage: 'Estufa de destino inválida' });

        const quantidadeLote = lote.itens_especies.reduce((sub, item) => sub + item.quantidade_atual, 0);

        const lotesNovaEstufa = await this.repository.buscarAtivosPorEstufa(nova_estufa_id);
        const ocupacaoNova = lotesNovaEstufa.reduce((total, l) => {
            return total + l.itens_especies.reduce((sub, item) => sub + item.quantidade_atual, 0);
        }, 0);

        if ((ocupacaoNova + quantidadeLote) > novaEstufa.capacidade_total) {
            throw new CustomError({ statusCode: 400, customMessage: 'Capacidade da nova estufa excedida' });
        }

        const estufaAntigaId = lote.estufa_id._id;
        await this.repository.atualizar(id, { estufa_id: nova_estufa_id });

        await this.estufaRepository.atualizar(estufaAntigaId, { status: STATUS_ESTUFA.Livre });

        if ((ocupacaoNova + quantidadeLote) >= novaEstufa.capacidade_total) {
            await this.estufaRepository.atualizar(nova_estufa_id, { status: STATUS_ESTUFA.Ocupada });
        }

        await this.auditoriaService.registrar({
            usuarioId: usuario?.id,
            acao: AUDITORIA_ACOES.TRANSFERIR_LOTE,
            entidade: AUDITORIA_ENTIDADES.LOTE,
            entidadeId: id,
        });

        return this.buscarPorId(id);
    }

    async deletar(id, justificativa, usuario) {
        const lote = await this.buscarPorId(id);
        
        for (const item of lote.itens_especies) {
            if (item.quantidade_atual > 0) {
                await this.movimentacaoService.criar({
                    especie_id: item.especie_id._id,
                    tipo: TIPO_MOVIMENTACAO.Mortalidade,
                    quantidade: item.quantidade_atual,
                    justificativa: justificativa || 'Descarte total do lote',
                    lote_id: id
                }, usuario);
            }
        }

        await this.repository.atualizar(id, { status: STATUS.Inativo });

        if (lote.estufa_id) {
            await this.estufaRepository.atualizar(lote.estufa_id._id, { status: STATUS_ESTUFA.Livre });
        }

        await this.auditoriaService.registrar({
            usuarioId: usuario?.id,
            acao: AUDITORIA_ACOES.CANCELAR_LOTE,
            entidade: AUDITORIA_ENTIDADES.LOTE,
            entidadeId: id,
        });
    }
}

export default LoteService;