import LoteModel from '../models/Lote.js';
import MovimentacaoModel from '../models/Movimentacao.js';
import EstufaModel from '../models/Estufa.js';
import EspecieModel from '../models/Especie.js';
import { FASE_LOTE } from '../constants/lote.js';
import { TIPO_MOVIMENTACAO } from '../constants/movimentacao.js';
import { STATUS_ESTUFA } from '../constants/estufa.js';

class DashboardRepository {

    async geral() {
        const [loteStats] = await LoteModel.aggregate([
            {
                $facet: {
                    lotesAtivos: [
                        { $match: { status: 'ATIVO' } },
                        { $count: 'n' },
                    ],
                    mudasProntas: [
                        { $match: { fase: FASE_LOTE.Pronto, status: 'ATIVO' } },
                        {
                            $project: {
                                total: {
                                    $sum: '$itens_especies.quantidade_atual',
                                },
                            },
                        },
                        { $group: { _id: null, total: { $sum: '$total' } } },
                    ],
                    porFase: [
                        { $match: { status: 'ATIVO' } },
                        { $group: { _id: '$fase', total: { $sum: 1 } } },
                        { $sort: { _id: 1 } },
                    ],
                    mortalidadeGlobal: [
                        { $match: { status: 'ATIVO' } },
                        {
                            $project: {
                                perdas: {
                                    $subtract: [
                                        { $sum: '$itens_especies.quantidade_inicial' },
                                        { $sum: '$itens_especies.quantidade_atual' },
                                    ],
                                },
                                total: { $sum: '$itens_especies.quantidade_inicial' },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalPerdas: { $sum: '$perdas' },
                                totalInicial: { $sum: '$total' },
                            },
                        },
                    ],
                },
            },
        ]);

        const [sementeira] = await EspecieModel.aggregate([
            { $match: { status: 'ATIVO' } },
            { $group: { _id: null, saldoTotal: { $sum: '$quantidade_atual' } } },
        ]);

        const [estufaStats] = await EstufaModel.aggregate([
            {
                $facet: {
                    total: [{ $count: 'n' }],
                    ocupadas: [{ $match: { status: STATUS_ESTUFA.Ocupada } }, { $count: 'n' }],
                    livres: [{ $match: { status: STATUS_ESTUFA.Livre } }, { $count: 'n' }],
                },
            },
        ]);

        const seteAtras = new Date();
        seteAtras.setDate(seteAtras.getDate() - 6);
        seteAtras.setHours(0, 0, 0, 0);

        const saidasUltimos7 = await MovimentacaoModel.aggregate([
            {
                $match: {
                    tipo: TIPO_MOVIMENTACAO.Expedicao,
                    data_registro: { $gte: seteAtras },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$data_registro' },
                    },
                    total: { $sum: '$quantidade' },
                },
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, data: '$_id', total: 1 } },
        ]);

        const lotesAltaMortalidade = await LoteModel.aggregate([
            { $match: { status: 'ATIVO' } },
            {
                $project: {
                    codigo: 1,
                    fase: 1,
                    quantidadeInicial: { $sum: '$itens_especies.quantidade_inicial' },
                    quantidadeAtual: { $sum: '$itens_especies.quantidade_atual' },
                },
            },
            {
                $match: {
                    quantidadeInicial: { $gt: 0 },
                    $expr: {
                        $gte: [
                            {
                                $divide: [
                                    { $subtract: ['$quantidadeInicial', '$quantidadeAtual'] },
                                    '$quantidadeInicial',
                                ],
                            },
                            0.3,
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    loteId: '$_id',
                    codigo: 1,
                    fase: 1,
                    mortalidadePct: {
                        $multiply: [
                            {
                                $divide: [
                                    { $subtract: ['$quantidadeInicial', '$quantidadeAtual'] },
                                    '$quantidadeInicial',
                                ],
                            },
                            100,
                        ],
                    },
                },
            },
            { $sort: { mortalidadePct: -1 } },
            { $limit: 10 },
        ]);

        const estufasLotadas = await EstufaModel.find({ status: STATUS_ESTUFA.Ocupada })
            .select('codigo_identificador localizacao_estufa capacidade_total')
            .lean();

        const totalLotesAtivos = loteStats.lotesAtivos[0]?.n || 0;
        const totalInicial = loteStats.mortalidadeGlobal[0]?.totalInicial || 0;
        const totalPerdas = loteStats.mortalidadeGlobal[0]?.totalPerdas || 0;
        const totalEstufas = estufaStats.total[0]?.n || 0;
        const totalOcupadas = estufaStats.ocupadas[0]?.n || 0;

        return {
            kpis: {
                mudasProntas: loteStats.mudasProntas[0]?.total || 0,
                lotesAtivos: totalLotesAtivos,
                saldoSementeira: sementeira?.saldoTotal || 0,
                mortalidadeGlobalPct: totalInicial > 0
                    ? Math.round((totalPerdas / totalInicial) * 100 * 10) / 10
                    : 0,
            },
            estufas: {
                total: totalEstufas,
                ocupadas: totalOcupadas,
                livres: estufaStats.livres[0]?.n || 0,
                taxaOcupacaoPct: totalEstufas > 0
                    ? Math.round((totalOcupadas / totalEstufas) * 100)
                    : 0,
            },
            lotesPorFase: loteStats.porFase.reduce(
                (acc, f) => ({ ...acc, [f._id]: f.total }), {}
            ),
            saidasUltimos7dias: saidasUltimos7,
            alertas: {
                lotesAltaMortalidade,
                estufasLotadas: estufasLotadas.map((e) => ({
                    estufaId: e._id,
                    codigo: e.codigo_identificador,
                    localizacao: e.localizacao_estufa,
                    capacidade: e.capacidade_total,
                })),
            },
        };
    }
}

export default DashboardRepository;
