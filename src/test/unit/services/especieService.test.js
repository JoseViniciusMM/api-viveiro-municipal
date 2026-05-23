// ============================================================
// TESTE DE UNIDADE — EspecieService
// ============================================================
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import CustomError from '../../../utils/helpers/CustomError.js'; 
import EspecieService from '../../../../src/services/especieService.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../../../../src/constants/auditoria.js';
import { STATUS } from '../../../../src/constants/lote.js';

// ──────────────────────────────────────────────────────────────
// SETUP: executado antes de cada teste
// ──────────────────────────────────────────────────────────────

let service;
let mockEspecieRepository;
let mockAuditoriaService;
let mockMovimentacaoRepository;

beforeEach(() => {
    mockEspecieRepository = {
        criar:      jest.fn(),
        buscarPorId: jest.fn(),
        atualizar:  jest.fn(),
        listar:     jest.fn(),
    };

    mockAuditoriaService = {
        registrar: jest.fn().mockResolvedValue(null),
    };

    mockMovimentacaoRepository = {
        listar: jest.fn(),
    };

    service = new EspecieService({
        especieRepository:    mockEspecieRepository,
        auditoriaService:     mockAuditoriaService,
        movimentacaoRepository: mockMovimentacaoRepository,
    });
});

// ──────────────────────────────────────────────────────────────
// GRUPO: criar
// ──────────────────────────────────────────────────────────────

describe('criar', () => {
    it('deve criar espécie com quantidade_atual zerada e status ATIVO', async () => {
    // Arrange
    const dadosFake = {
        nome_popular:    'Ipê Amarelo',
        nome_cientifico: 'Handroanthus albus',
        variedade:       'Comum',
        categoria:       'ARBOREA',
        tipo:            'SEMENTE',
    };
    const especieCriada = { ...dadosFake, _id: 'esp-1', id: 'esp-1', quantidade_atual: 0 };
    mockEspecieRepository.criar.mockResolvedValue(especieCriada);
    mockEspecieRepository.buscarPorId.mockResolvedValue(especieCriada);

    // Act
    const resultado = await service.criar(dadosFake, 'usuario-1');

    // Assert
    expect(mockEspecieRepository.criar).toHaveBeenCalledWith(
        expect.objectContaining({
            quantidade_atual: 0,
            status: STATUS.Ativo,
        })
    );
    expect(resultado).toEqual(especieCriada);
});

    it('deve registrar auditoria após criar espécie', async () => {
    // Arrange
    const especieCriada = { _id: 'esp-1', id: 'esp-1' };
    mockEspecieRepository.criar.mockResolvedValue(especieCriada);
    mockEspecieRepository.buscarPorId.mockResolvedValue(especieCriada);

    // Act
    await service.criar({ nome_popular: 'Ipê', variedade: 'Comum', categoria: 'ARBOREA', tipo: 'SEMENTE' }, 'usuario-1');

    // Assert
    expect(mockAuditoriaService.registrar).toHaveBeenCalledTimes(1);
    expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
            acao:      AUDITORIA_ACOES.CRIAR_ESPECIE,
            entidade:  AUDITORIA_ENTIDADES.ESPECIE,
            entidadeId: 'esp-1',
        })
    );
});

    it('deve salvar nome_cientifico como null quando não informado', async () => {
    // Arrange
    const especieCriada = { _id: 'esp-1', id: 'esp-1', nome_cientifico: null };
    mockEspecieRepository.criar.mockResolvedValue(especieCriada);
    mockEspecieRepository.buscarPorId.mockResolvedValue(especieCriada);

    // Act
    await service.criar({ nome_popular: 'Ipê', variedade: 'Comum', categoria: 'ARBOREA', tipo: 'SEMENTE' }, 'usuario-1');

    // Assert
    expect(mockEspecieRepository.criar).toHaveBeenCalledWith(
        expect.objectContaining({ nome_cientifico: null })
        );
    });
});

// ──────────────────────────────────────────────────────────────
// GRUPO: listar
// ──────────────────────────────────────────────────────────────

describe('listar', () => {
    it('deve chamar repository.listar com filtros e paginação corretos', async () => {
    // Arrange
    const resultadoFake = { docs: [], totalDocs: 0 };
    mockEspecieRepository.listar.mockResolvedValue(resultadoFake);

    // Act
    const resultado = await service.listar({ filtros: { categoria: 'ARBOREA' }, page: '2', limit: '10' });

    // Assert
    expect(mockEspecieRepository.listar).toHaveBeenCalledWith({
        filtros: { categoria: 'ARBOREA' },
        page:    2,   // deve converter string para número
        limit:   10,
    });
    expect(resultado).toBe(resultadoFake);
});

    it('deve ignorar filtros não enviados', async () => {
    // Arrange
    mockEspecieRepository.listar.mockResolvedValue({ docs: [] });

    // Act
    await service.listar({});

    // Assert — filtros deve ser objeto vazio
    expect(mockEspecieRepository.listar).toHaveBeenCalledWith(
        expect.objectContaining({ filtros: {} })
        );
    });
});

// ──────────────────────────────────────────────────────────────
// GRUPO: buscarPorId
// ──────────────────────────────────────────────────────────────

describe('buscarPorId', () => {
    it('deve retornar a espécie quando encontrada', async () => {
    // Arrange
    const especieFake = { _id: 'esp-1', nome_popular: 'Ipê Amarelo' };
    mockEspecieRepository.buscarPorId.mockResolvedValue(especieFake);

    // Act
    const resultado = await service.buscarPorId('esp-1');

    // Assert
    expect(resultado).toEqual(especieFake);
    });

    it('deve lançar erro 404 quando espécie não existe', async () => {
    // Arrange
    mockEspecieRepository.buscarPorId.mockResolvedValue(null);

    // Act & Assert
    await expect(service.buscarPorId('id-inexistente')).rejects.toMatchObject({
        statusCode: 404,
        });
    });
});

// ──────────────────────────────────────────────────────────────
// GRUPO: atualizar
// ──────────────────────────────────────────────────────────────

describe('atualizar', () => {
    it('deve atualizar a espécie e registrar auditoria', async () => {
    // Arrange
    const especieExistente  = { _id: 'esp-1', nome_popular: 'Ipê' };
    const especieAtualizada = { _id: 'esp-1', nome_popular: 'Ipê Roxo' };
    mockEspecieRepository.buscarPorId.mockResolvedValue(especieExistente);
    mockEspecieRepository.atualizar.mockResolvedValue(especieAtualizada);

    // Act
    const resultado = await service.atualizar('esp-1', { nome_popular: 'Ipê Roxo' }, 'usuario-1');

    // Assert
    expect(mockEspecieRepository.atualizar).toHaveBeenCalledWith(
        'esp-1',
        expect.objectContaining({ nome_popular: 'Ipê Roxo' })
    );
    expect(resultado).toEqual(especieAtualizada);
    expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ acao: AUDITORIA_ACOES.ATUALIZAR_ESPECIE })
        );
    });

    it('deve bloquear alteração de quantidade_atual', async () => {
    // Arrange
    mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: 'esp-1' });
    mockEspecieRepository.atualizar.mockResolvedValue({ _id: 'esp-1' });

    // Act
    await service.atualizar('esp-1', { quantidade_atual: 999 }, 'usuario-1');

    // Assert — quantidade_atual não pode ir para o repositório
    expect(mockEspecieRepository.atualizar).toHaveBeenCalledWith(
        'esp-1',
        expect.not.objectContaining({ quantidade_atual: expect.anything() })
        );
    });

    it('deve bloquear alteração de tipo', async () => {
    // Arrange
    mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: 'esp-1' });
    mockEspecieRepository.atualizar.mockResolvedValue({ _id: 'esp-1' });

    // Act
    await service.atualizar('esp-1', { tipo: 'MUDA' }, 'usuario-1');

    // Assert — tipo não pode ir para o repositório
    expect(mockEspecieRepository.atualizar).toHaveBeenCalledWith(
        'esp-1',
        expect.not.objectContaining({ tipo: expect.anything() })
    );
});

    it('deve lançar erro 404 quando espécie não existe', async () => {
    // Arrange
    mockEspecieRepository.buscarPorId.mockResolvedValue(null);

    // Act & Assert
    await expect(service.atualizar('id-inexistente', {}, 'usuario-1')).rejects.toMatchObject({
        statusCode: 404,
    });
        expect(mockEspecieRepository.atualizar).not.toHaveBeenCalled();
    });
});


// ──────────────────────────────────────────────────────────────
// GRUPO: obterHistorico
// ──────────────────────────────────────────────────────────────

describe('obterHistorico', () => {
    it('deve retornar movimentações da espécie', async () => {
    // Arrange
    const especieFake      = { _id: 'esp-1' };
    const movimentacoesFake = { docs: [{ tipo: 'ENTRADA', quantidade: 100 }], totalDocs: 1 };
    mockEspecieRepository.buscarPorId.mockResolvedValue(especieFake);
    mockMovimentacaoRepository.listar.mockResolvedValue(movimentacoesFake);

    // Act
    const resultado = await service.obterHistorico('esp-1');

    // Assert
    expect(mockMovimentacaoRepository.listar).toHaveBeenCalledWith(
        expect.objectContaining({ filtros: { especie_id: 'esp-1' } })
    );
    expect(resultado).toEqual(movimentacoesFake);
    });

    it('deve lançar erro 404 quando espécie não existe', async () => {
    // Arrange
    mockEspecieRepository.buscarPorId.mockResolvedValue(null);

    // Act & Assert
    await expect(service.obterHistorico('id-inexistente')).rejects.toMatchObject({
        statusCode: 404,
    });
    expect(mockMovimentacaoRepository.listar).not.toHaveBeenCalled();
    });
});