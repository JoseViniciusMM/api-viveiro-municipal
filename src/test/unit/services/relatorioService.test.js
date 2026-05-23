// ============================================================
// TESTE DE UNIDADE — RelatorioService
// ============================================================

import RelatorioService from "../../../services/RelatorioService.js";
import { TIPO_MOVIMENTACAO } from "../../../constants/movimentacao.js";
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// ──────────────────────────────────────────────────────────────
// SETUP: executado antes de cada teste
// ──────────────────────────────────────────────────────────────

let service;
let mockLoteRepository;
let mockMovimentacaoRepository;

beforeEach(() => {
    mockLoteRepository = {
        listar: jest.fn(),
    };

    mockMovimentacaoRepository = {
        listar: jest.fn(),
    };

    service = new RelatorioService({
        loteRepository:             mockLoteRepository,
        movimentacaoRepository:     mockMovimentacaoRepository,
    })
})

// ──────────────────────────────────────────────────────────────
// GRUPO: listarLotes
// ──────────────────────────────────────────────────────────────

describe('listarLotes', () => {
    it('dev chamar loteRepository.listar com filtros e paginação corretos', async () => {
        // Arrange
        const resultadoFake = { docs: [], totalDocs: 0 };
        mockLoteRepository.listar.mockResolvedValue(resultadoFake);

        // Act
        const resultado = await service.listarLotes({
            filtros: {especie_id: 'esp-1', fase: 'GERMINACAO'},
            page: 1,
            limit: 20,
        });

        // Assert
        expect(mockLoteRepository.listar).toHaveBeenCalledWith({
            filtros: {especie_id: 'esp-1', fase: 'GERMINACAO'},
            page: 1,
            limit: 20,
        });
        expect(resultado).toBe(resultadoFake)    
    })

    it('deve usar valores padrão quando page e limit não são informados', async () => {
        // Arrange
        mockLoteRepository.listar.mockResolvedValue({ docs: [] });

        // Act
        await service.listarLotes({});

        // Assert
        expect(mockLoteRepository.listar).toHaveBeenCalledWith({
            filtros: {},
            page:    1,
            limit:   20,
        });
    });
}); 


// ──────────────────────────────────────────────────────────────
// GRUPO: listarMovimentacoes
// ──────────────────────────────────────────────────────────────

describe('listarMovimentacoes', () => {
    it('deve chamar movimentacaoRepository.listar com filtros e paginação corretos', async () => {
    // Arrange
    const resultadoFake = { docs: [], totalDocs: 0 };
    mockMovimentacaoRepository.listar.mockResolvedValue(resultadoFake);

    // Act
    const resultado = await service.listarMovimentacoes({
        filtros: { tipo: 'ENTRADA', especie_id: 'esp-1' },
        page:    2,
        limit:   10,
    });

    // Assert
    expect(mockMovimentacaoRepository.listar).toHaveBeenCalledWith({
        filtros: { tipo: 'ENTRADA', especie_id: 'esp-1' },
        page:    2,
        limit:   10,
    });
    expect(resultado).toBe(resultadoFake);
    });

    it('deve usar valores padrão quando page e limit não são informados', async () => {
    // Arrange
    mockMovimentacaoRepository.listar.mockResolvedValue({ docs: [] });

    // Act
    await service.listarMovimentacoes({});

    // Assert
    expect(mockMovimentacaoRepository.listar).toHaveBeenCalledWith({
        filtros: {},
        page:    1,
        limit:   20,
        });
    });
});

// ──────────────────────────────────────────────────────────────
// GRUPO: listarMovimentacoes
// ──────────────────────────────────────────────────────────────

describe('listarMovimentacoes', () => {
    it('deve chamar movimentacaoRepository.listar com filtros e paginação corretos', async () => {
    // Arrange
    const resultadoFake = { docs: [], totalDocs: 0 };
    mockMovimentacaoRepository.listar.mockResolvedValue(resultadoFake);

    // Act
    const resultado = await service.listarMovimentacoes({
        filtros: { tipo: 'ENTRADA', especie_id: 'esp-1' },
        page:    2,
        limit:   10,
    });

    // Assert
    expect(mockMovimentacaoRepository.listar).toHaveBeenCalledWith({
        filtros: { tipo: 'ENTRADA', especie_id: 'esp-1' },
        page:    2,
        limit:   10,
    });
    expect(resultado).toBe(resultadoFake);
    });

    it('deve usar valores padrão quando page e limit não são informados', async () => {
    // Arrange
    mockMovimentacaoRepository.listar.mockResolvedValue({ docs: [] });

    // Act
    await service.listarMovimentacoes({});

    // Assert
    expect(mockMovimentacaoRepository.listar).toHaveBeenCalledWith({
        filtros: {},
        page:    1,
        limit:   20,
        });
    });
});

// ──────────────────────────────────────────────────────────────
// GRUPO: listarMortalidade
// ──────────────────────────────────────────────────────────────

describe('listarMortalidade', () => {
    it('deve lançar erro quando data_inicio não é informada', async () => {
    // Act & Assert
    await expect(
        service.listarMortalidade({ filtros: { data_fim: '2026-03-31' } })
    ).rejects.toThrow('Filtro de data_inicio e data_fim é obrigatório.');

    expect(mockMovimentacaoRepository.listar).not.toHaveBeenCalled();
    });
    
    it('deve lançar erro quando data_fim não é informada', async () => {
    // Act & Assert
    await expect(
        service.listarMortalidade({ filtros: { data_inicio: '2026-03-01' } })
    ).rejects.toThrow('Filtro de data_inicio e data_fim é obrigatório.');

    expect(mockMovimentacaoRepository.listar).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando nenhuma data é informada', async () => {
    // Act & Assert
    await expect(
        service.listarMortalidade({ filtros: {} })
    ).rejects.toThrow('Filtro de data_inicio e data_fim é obrigatório.');
    });

    it('deve chamar movimentacaoRepository com tipo PERDA quando datas são informadas', async () => {
    // Arrange
    const resultadoFake = { docs: [], totalDocs: 0 };
    mockMovimentacaoRepository.listar.mockResolvedValue(resultadoFake);

    // Act
    const resultado = await service.listarMortalidade({
        filtros: { data_inicio: '2026-03-01', data_fim: '2026-03-31' },
        page:    1,
        limit:   20,
    });

    // Assert 
    expect(mockMovimentacaoRepository.listar).toHaveBeenCalledWith({
        filtros: {
        data_inicio: '2026-03-01',
        data_fim:    '2026-03-31',
        tipo:        'MORTALIDADE',
        },
        page:  1,
        limit: 20,
    });
    expect(resultado).toBe(resultadoFake);
    })

    it('deve incluir filtros extras como especie_id junto com o tipo MORTALIDADE', async () => {
    // Arrange
    mockMovimentacaoRepository.listar.mockResolvedValue({ docs: [] });

    // Act
    await service.listarMortalidade({
        filtros: {
        data_inicio: '2026-03-01',
        data_fim:    '2026-03-31',
        especie_id:  'esp-1',
        },
    });

    // Assert 
    expect(mockMovimentacaoRepository.listar).toHaveBeenCalledWith(
        expect.objectContaining({
            filtros: expect.objectContaining({
            especie_id: 'esp-1',
            tipo:       'MORTALIDADE',
            }),
        })
        );
    });
});                                                 