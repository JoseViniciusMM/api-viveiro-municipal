import { CustomError, messages } from '../utils/helpers/index.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../constants/auditoria.js';
import { TIPO_MOVIMENTACAO } from '../constants/movimentacao.js';
import { STATUS_DESTINATARIO } from '../constants/destinatario.js';
import { STATUS } from '../constants/lote.js';

class MovimentacaoService {
    constructor({ movimentacaoRepository, especieRepository, loteRepository, destinatarioRepository, auditoriaService }) {
        this.repository = movimentacaoRepository;
        this.especieRepository = especieRepository;
        this.loteRepository = loteRepository;
        this.destinatarioRepository = destinatarioRepository;
        this.auditoriaService = auditoriaService;
    }

    async listar({ filtros = {}, page = 1, limit = 20 }) {
        return this.repository.listar({ filtros, page: Number(page), limit: Number(limit) });
    }

    async buscarPorId(id) {
        const movimentacao = await this.repository.buscarPorId(id);
        if (!movimentacao) {
            throw new CustomError({
                statusCode: 404,
                customMessage: messages.error.resourceNotFound('Movimentação'),
            });
        }
        return movimentacao;
    }

    
    async criar(dados, usuario) {
        const { especie_id, tipo, quantidade, lote_id, destinatario_id } = dados;

        const especie = await this.especieRepository.buscarPorId(especie_id);
        if (!especie) {
            throw new CustomError({ statusCode: 404, customMessage: 'Espécie não encontrada' });
        }

        let lote = null;
        let itemIndex = -1;

        if (tipo === TIPO_MOVIMENTACAO.Expedicao || tipo === TIPO_MOVIMENTACAO.Mortalidade) {
            if (!lote_id) throw new CustomError({ statusCode: 400, customMessage: 'ID do Lote é obrigatório para este tipo' });
            
            lote = await this.loteRepository.buscarPorId(lote_id);
            if (!lote) throw new CustomError({ statusCode: 404, customMessage: 'Lote não encontrado' });

            itemIndex = lote.itens_especies.findIndex(i => i.especie_id.toString() === especie_id.toString() || i.especie_id._id?.toString() === especie_id.toString());
            if (itemIndex === -1) throw new CustomError({ statusCode: 404, customMessage: 'Espécie não encontrada neste lote' });

            if (tipo === TIPO_MOVIMENTACAO.Expedicao) {
                if (!destinatario_id) throw new CustomError({ statusCode: 400, customMessage: 'Destinatário obrigatório para expedição' });
                const dest = await this.destinatarioRepository.buscarPorId(destinatario_id);
                if (!dest || dest.status !== STATUS_DESTINATARIO.Ativo) {
                    throw new CustomError({ statusCode: 400, customMessage: 'Destinatário inválido ou inativo' });
                }
            }

            if (lote.itens_especies[itemIndex].quantidade_atual < Math.abs(quantidade)) {
                throw new CustomError({ statusCode: 400, customMessage: 'Saldo insuficiente no lote' });
            }
        }

        const afetaSementeira = [TIPO_MOVIMENTACAO.Entrada, TIPO_MOVIMENTACAO.Saida, TIPO_MOVIMENTACAO.Ajuste].includes(tipo);
        let novoSaldoEspecie = especie.quantidade_atual;
        
        if (afetaSementeira) {
            const eSoma = tipo === TIPO_MOVIMENTACAO.Entrada || (tipo === TIPO_MOVIMENTACAO.Ajuste && quantidade > 0);
            if (eSoma) {
                novoSaldoEspecie += Math.abs(quantidade);
            } else {
                if (especie.quantidade_atual < Math.abs(quantidade)) {
                    throw new CustomError({ statusCode: 400, customMessage: 'Saldo insuficiente na sementeira' });
                }
                novoSaldoEspecie -= Math.abs(quantidade);
            }
        }

        const movimentacao = await this.repository.criar({
            ...dados,
            usuario_id: usuario?.id
        });

        if (afetaSementeira) {
            await this.especieRepository.atualizar(especie_id, { quantidade_atual: novoSaldoEspecie });
        }

        if (tipo === TIPO_MOVIMENTACAO.Expedicao || tipo === TIPO_MOVIMENTACAO.Mortalidade) {
            lote.itens_especies[itemIndex].quantidade_atual -= Math.abs(quantidade);
            await this.loteRepository.atualizar(lote_id, { itens_especies: lote.itens_especies });
        }

        await this.auditoriaService.registrar({
            usuarioId: usuario?.id,
            acao: AUDITORIA_ACOES.CRIAR_MOVIMENTACAO,
            entidade: AUDITORIA_ENTIDADES.MOVIMENTACAO,
            entidadeId: movimentacao.id,
        });

        return movimentacao;
    }

    async estornar(id, usuario) {
        const original = await this.buscarPorId(id);

        if (original.tipo === TIPO_MOVIMENTACAO.Saida && original.lote_id) {
            throw new CustomError({ statusCode: 400, customMessage: 'Não é possível estornar uma saída de alocação de lote diretamente. Cancele o lote.' });
        }

        const dadosEstorno = {
            especie_id: original.especie_id,
            tipo: TIPO_MOVIMENTACAO.Estorno, 
            quantidade: original.quantidade,
            justificativa: `ESTORNO DA MOVIMENTAÇÃO ID: ${original._id}`,
            usuario_id: usuario?.id,
            lote_id: original.lote_id,
            destinatario_id: original.destinatario_id
        };

        const afetaSementeira = [TIPO_MOVIMENTACAO.Entrada, TIPO_MOVIMENTACAO.Saida, TIPO_MOVIMENTACAO.Ajuste].includes(original.tipo);
        if (afetaSementeira) {
            const especie = await this.especieRepository.buscarPorId(original.especie_id);
            let novoSaldo = especie.quantidade_atual;
            const isAdicaoOriginal = original.tipo === TIPO_MOVIMENTACAO.Entrada || (original.tipo === TIPO_MOVIMENTACAO.Ajuste && original.quantidade > 0);
            
            if (isAdicaoOriginal) novoSaldo -= Math.abs(original.quantidade);
            else novoSaldo += Math.abs(original.quantidade);
            
            if (novoSaldo < 0) {
                throw new CustomError({ statusCode: 400, customMessage: 'Estorno não permitido: o saldo da sementeira ficaria negativo.' });
            }

            await this.especieRepository.atualizar(original.especie_id, { quantidade_atual: novoSaldo });
        }

        if ([TIPO_MOVIMENTACAO.Expedicao, TIPO_MOVIMENTACAO.Mortalidade].includes(original.tipo) && original.lote_id) {
            const lote = await this.loteRepository.buscarPorId(original.lote_id);
            if (lote) {
                if (lote.status !== STATUS.Ativo) {
                    throw new CustomError({ statusCode: 400, customMessage: 'Estorno não permitido: o lote atrelado encontra-se inativo ou finalizado.' });
                }

                const itemIndex = lote.itens_especies.findIndex(i => i.especie_id.toString() === original.especie_id.toString() || i.especie_id._id?.toString() === original.especie_id.toString());
                if (itemIndex > -1) {
                    lote.itens_especies[itemIndex].quantidade_atual += Math.abs(original.quantidade);
                    await this.loteRepository.atualizar(original.lote_id, { itens_especies: lote.itens_especies });
                }
            }
        }

        const estorno = await this.repository.criar({ ...dadosEstorno, usuario_id: usuario?.id });

        await this.auditoriaService.registrar({
            usuarioId: usuario?.id,
            acao: AUDITORIA_ACOES.ESTORNAR_MOVIMENTACAO,
            entidade: AUDITORIA_ENTIDADES.MOVIMENTACAO,
            entidadeId: id,
        });

        return estorno;
    }
}

export default MovimentacaoService;