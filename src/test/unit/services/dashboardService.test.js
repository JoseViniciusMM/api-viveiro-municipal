import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import CustomError from '../../../../src/utils/helpers/CustomError.js';

const { default: DashboardService } = await import('../../../../src/services/dashboardService.js');

let service;
let mockDashboardRepository;

const makeResumo = (props = {}) => ({
    kpis: {
        mudasProntas: 1200,
        lotesAtivos: 8,
        saldoSementeira: 3400,
        mortalidadeGlobalPct: 4.2,
    },
    estufas: {
        total: 10,
        ocupadas: 7,
        livres: 3,
        taxaOcupacaoPct: 70,
    },
    lotesPorFase: { Semeadura: 3, Crescimento: 3, Pronto: 2 },
    saidasUltimos7dias: [],
    alertas: { lotesAltaMortalidade: [], estufasLotadas: [] },
    ...props,
});

const makeUsuario = (cargo = 'ADMINISTRADOR') => ({
    _id: 'u1',
    nome: 'Admin',
    cargo,
    papeis: [cargo],
});

beforeEach(() => {
    jest.clearAllMocks();

    mockDashboardRepository = {
        geral: jest.fn(),
    };

    service = new DashboardService({
        dashboardRepository: mockDashboardRepository,
    });
});

describe('geral', () => {
    it('deve retornar o resumo completo do viveiro para um ADMINISTRADOR', async () => {
        mockDashboardRepository.geral.mockResolvedValue(makeResumo());

        const result = await service.geral(makeUsuario('ADMINISTRADOR'));

        expect(mockDashboardRepository.geral).toHaveBeenCalled();
        expect(result).toHaveProperty('kpis');
        expect(result).toHaveProperty('estufas');
        expect(result).toHaveProperty('lotesPorFase');
        expect(result).toHaveProperty('saidasUltimos7dias');
        expect(result).toHaveProperty('alertas');
    });

    it('deve retornar o resumo completo do viveiro para um OPERADOR', async () => {
        mockDashboardRepository.geral.mockResolvedValue(makeResumo());

        const result = await service.geral(makeUsuario('OPERADOR'));

        expect(mockDashboardRepository.geral).toHaveBeenCalled();
        expect(result).toHaveProperty('kpis');
    });

    it('deve retornar undefined ao tentar acessar o dashboard sem permissão', async () => {
        const usuarioSemAcesso = { _id: 'u2', papeis: [] };

        const result = await service.geral(usuarioSemAcesso);
        
        expect(result).toBeUndefined();
        expect(mockDashboardRepository.geral).toHaveBeenCalled();
    });

    it('deve lançar erro 403 ao tentar acessar o dashboard sem usuário autenticado', async () => {
        await expect(service.geral(null)).rejects.toThrow(CustomError);
        await expect(service.geral(null)).rejects.toMatchObject({ statusCode: 403 });
        expect(mockDashboardRepository.geral).not.toHaveBeenCalled();
    });

    it('deve retornar os KPIs com os campos corretos', async () => {
        mockDashboardRepository.geral.mockResolvedValue(makeResumo());

        const result = await service.geral(makeUsuario('ADMINISTRADOR'));

        expect(result.kpis).toHaveProperty('mudasProntas');
        expect(result.kpis).toHaveProperty('lotesAtivos');
        expect(result.kpis).toHaveProperty('saldoSementeira');
        expect(result.kpis).toHaveProperty('mortalidadeGlobalPct');
    });

    it('deve retornar os dados de estufas com taxa de ocupação calculada', async () => {
        mockDashboardRepository.geral.mockResolvedValue(makeResumo());

        const result = await service.geral(makeUsuario('ADMINISTRADOR'));

        expect(result.estufas).toHaveProperty('total');
        expect(result.estufas).toHaveProperty('ocupadas');
        expect(result.estufas).toHaveProperty('livres');
        expect(result.estufas).toHaveProperty('taxaOcupacaoPct');
    });

    it('deve retornar a seção de alertas com lotes de alta mortalidade e estufas lotadas', async () => {
        const resumoComAlertas = makeResumo({
            alertas: {
                lotesAltaMortalidade: [{ loteId: 'l1', codigo: 'LOTE-001', mortalidadePct: 45 }],
                estufasLotadas: [{ estufaId: 'e1', codigo: 'EST-01', capacidade: 500 }],
            },
        });
        mockDashboardRepository.geral.mockResolvedValue(resumoComAlertas);

        const result = await service.geral(makeUsuario('ADMINISTRADOR'));

        expect(result.alertas.lotesAltaMortalidade).toHaveLength(1);
        expect(result.alertas.estufasLotadas).toHaveLength(1);
    });
});
