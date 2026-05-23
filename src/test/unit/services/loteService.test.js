import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import CustomError from '../../../../src/utils/helpers/CustomError.js';
import { TIPO_MOVIMENTACAO } from '../../../../src/constants/movimentacao.js';
import { FASE_LOTE, STATUS } from '../../../../src/constants/lote.js';
import { STATUS_ESTUFA } from '../../../../src/constants/estufa.js';
import { AUDITORIA_ENTIDADES } from '../../../../src/constants/auditoria.js';

const { default: LoteService } = await import('../../../../src/services/loteService.js');

let service;
let mockLoteRepository;
let mockEstufaRepository;
let mockEspecieRepository;
let mockMovimentacaoService;
let mockAuditoriaService;

const makeLote = (props = {}) => ({
    _id: "l1",
    codigo: "LOTE-001",
    estufa_id: "estufa1",
    itens_especies: [{
        especie_id: "e1",
        quantidade_inicial: 200,
        quantidade_atual: 200
    }],
    fase: FASE_LOTE.Semeadura,
    status: STATUS.Ativo,
    ...props
});

beforeEach(() => {
    jest.clearAllMocks();

    mockLoteRepository = {
        criar: jest.fn(),
        listar: jest.fn(),
        buscarPorId: jest.fn(),
        buscarPorIdComDetalhes: jest.fn(),
        buscarAtivosPorEstufa: jest.fn(),
        atualizar: jest.fn(),
    };

    mockEstufaRepository = {
        buscarPorId: jest.fn(),
        atualizar: jest.fn()
    };

    mockEspecieRepository = {
        buscarPorId: jest.fn()
    };

    mockMovimentacaoService = {
        criar: jest.fn(),
        listar: jest.fn()
    };

    mockAuditoriaService = {
        registrar: jest.fn().mockResolvedValue(null),
        listar: jest.fn()
    };

    service = new LoteService({
        loteRepository: mockLoteRepository,
        estufaRepository: mockEstufaRepository,
        especieRepository: mockEspecieRepository,
        movimentacaoService: mockMovimentacaoService,
        auditoriaService: mockAuditoriaService
    });
});

describe("criar", () => {
    it("deve criar o lote, registrar a SAÍDA na sementeira e ocupar a estufa corretamente", async () => {
        mockEstufaRepository.buscarPorId.mockResolvedValue({ _id: "estufa1", capacidade_total: 1000 });
        mockLoteRepository.buscarAtivosPorEstufa.mockResolvedValue([]); 
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 500 });
        
        mockLoteRepository.criar.mockResolvedValue(makeLote());

        const payload = {
            itens_especies: [{
                especie_id: "e1",
                quantidade_inicial: 200
            }],
            estufa_id: "estufa1",
        };
        const result = await service.criar(payload, { id: "u1" });

        expect(mockLoteRepository.criar).toHaveBeenCalled();
        expect(mockMovimentacaoService.criar).toHaveBeenCalledWith(
            expect.objectContaining({ tipo: TIPO_MOVIMENTACAO.Saida, quantidade: 200 }), 
            { id: "u1" }
        );
        expect(result).toHaveProperty("_id", "l1");
    });

    it("deve lançar erro ao tentar criar um lote maior que a capacidade disponível na estufa", async () => {
        mockEstufaRepository.buscarPorId.mockResolvedValue({ _id: "estufa1", capacidade_total: 500 });
        mockLoteRepository.buscarAtivosPorEstufa.mockResolvedValue([{ 
            itens_especies: [{ quantidade_atual: 400 }] 
        }]); 
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 500 });

        const action = service.criar({
            itens_especies: [{ especie_id: "e1", quantidade_inicial: 200 }],
            estufa_id: "estufa1",
        }, { id: "u1" });
        
        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: "Capacidade máxima da estufa excedida" });
        
        expect(mockLoteRepository.criar).not.toHaveBeenCalled();
    });
});

describe("atualizarFase", () => {
    it("deve atualizar a fase biológica do lote com sucesso", async () => {
        mockLoteRepository.buscarPorIdComDetalhes.mockResolvedValue(makeLote({ fase: FASE_LOTE.Semeadura }));
        mockLoteRepository.atualizar.mockResolvedValue(makeLote({ fase: FASE_LOTE.Pronto }));

        await service.atualizarFase("l1", FASE_LOTE.Pronto, { id: "u1" });

        expect(mockLoteRepository.atualizar).toHaveBeenCalledWith("l1", { fase: FASE_LOTE.Pronto });
        expect(mockAuditoriaService.registrar).toHaveBeenCalled();
    });
});

describe("registrarMortalidade", () => {
    it("deve registrar a MORTALIDADE através do MovimentacaoService mantendo a estufa inalterada", async () => {
        const loteExistente = makeLote({
            itens_especies: [{ 
                especie_id: { _id: "e1" }, 
                quantidade_atual: 100 
            }],
            estufa_id: { _id: "estufa1", status: STATUS_ESTUFA.Ocupada }
        });
        mockLoteRepository.buscarPorIdComDetalhes.mockResolvedValue(loteExistente);
        mockEstufaRepository.buscarPorId.mockResolvedValue({ _id: "estufa1", capacidade_maxima: 1000 });
        mockLoteRepository.buscarAtivosPorEstufa.mockResolvedValue([loteExistente]); 

        await service.registrarMortalidade("l1", {
            especie_id: "e1",
            quantidade: 20,
            justificativa: "Praga"
        }, { id: "u1" });

        expect(mockMovimentacaoService.criar).toHaveBeenCalledWith(
            expect.objectContaining({ tipo: TIPO_MOVIMENTACAO.Mortalidade, quantidade: 20, lote_id: "l1" }),
            { id: "u1" }
        );
        expect(mockEstufaRepository.atualizar).not.toHaveBeenCalled();
    });
});

describe("transferir", () => {
    it("deve transferir o lote, liberando a estufa de origem e ocupando a estufa de destino", async () => {
        const loteOriginal = makeLote({ estufa_id: { _id: "estufa_origem" } });
        mockLoteRepository.buscarPorIdComDetalhes.mockResolvedValue(loteOriginal);
        
        mockEstufaRepository.buscarPorId.mockResolvedValue({ _id: "estufa_destino", capacidade_total: 200 });
        mockLoteRepository.buscarAtivosPorEstufa.mockResolvedValue([]);

        await service.transferir("l1", "estufa_destino", { id: "u1" });

        expect(mockEstufaRepository.atualizar).toHaveBeenCalledWith("estufa_origem", expect.objectContaining({ status: STATUS_ESTUFA.Livre }));
        expect(mockEstufaRepository.atualizar).toHaveBeenCalledWith("estufa_destino", expect.objectContaining({ status: STATUS_ESTUFA.Ocupada }));
        expect(mockLoteRepository.atualizar).toHaveBeenCalledWith("l1", { estufa_id: "estufa_destino" });
        expect(mockAuditoriaService.registrar).toHaveBeenCalled();
    });

    it("deve lançar erro ao tentar transferir para uma estufa sem capacidade física suficiente", async () => {
        const loteOriginal = makeLote({ 
            estufa_id: { _id: "estufa_origem" },
            itens_especies: [{ quantidade_atual: 200 }]
        });
        mockLoteRepository.buscarPorIdComDetalhes.mockResolvedValue(loteOriginal);
        
        mockEstufaRepository.buscarPorId.mockResolvedValue({ _id: "estufa_destino", capacidade_total: 200 });
        mockLoteRepository.buscarAtivosPorEstufa.mockResolvedValue([{ itens_especies: [{ quantidade_atual: 150 }] }]);

        const action = service.transferir("l1", "estufa_destino", { id: "u1" });
        
        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: "Capacidade da nova estufa excedida" });
        
        expect(mockLoteRepository.atualizar).not.toHaveBeenCalled();
    });
});

describe("deletar", () => {
    it("deve descartar o lote, registrar a MORTALIDADE das plantas e liberar a estufa", async () => {
        const loteOriginal = makeLote({
            estufa_id: { _id: "estufa1" },
            itens_especies: [{
                especie_id: { _id: "e1" },
                quantidade_atual: 200
            }]
        });
        mockLoteRepository.buscarPorIdComDetalhes.mockResolvedValue(loteOriginal);

        await service.deletar("l1", "Erro no plantio", { id: "u1" });

        expect(mockMovimentacaoService.criar).toHaveBeenCalledWith(
            expect.objectContaining({ tipo: TIPO_MOVIMENTACAO.Mortalidade, lote_id: "l1" }),
            { id: "u1" }
        );
        expect(mockLoteRepository.atualizar).toHaveBeenCalledWith("l1", expect.objectContaining({ status: STATUS.Inativo }));
        expect(mockEstufaRepository.atualizar).toHaveBeenCalledWith("estufa1", expect.objectContaining({ status: STATUS_ESTUFA.Livre }));
    });
});

describe("buscarPorId", () => {
    it("deve retornar os dados detalhados do lote correspondente ao ID informado", async () => {
        mockLoteRepository.buscarPorIdComDetalhes.mockResolvedValue(makeLote());

        const result = await service.buscarPorId("l1");

        expect(mockLoteRepository.buscarPorIdComDetalhes).toHaveBeenCalledWith("l1");
        expect(result).toHaveProperty("_id", "l1");
    });

    it("deve lançar erro amigável ao tentar buscar um ID de lote inexistente", async () => {
        mockLoteRepository.buscarPorIdComDetalhes.mockResolvedValue(null);
        await expect(service.buscarPorId("invalid_id")).rejects.toThrow(CustomError);
    });
});

describe("listar", () => {
    it("deve listar os lotes aplicando corretamente os parâmetros de filtros e paginação informados", async () => {
        mockLoteRepository.listar.mockResolvedValue({ docs: [], totalDocs: 0 });
        await service.listar({ filtros: { fase: FASE_LOTE.Pronto }, page: 1, limit: 10 });
        expect(mockLoteRepository.listar).toHaveBeenCalled();
    });
});

describe("buscarHistorico", () => {
    it("deve retornar o histórico completo agrupando movimentações e os logs de auditoria", async () => {
        mockLoteRepository.buscarPorIdComDetalhes.mockResolvedValue(makeLote());
        mockMovimentacaoService.listar.mockResolvedValue({ docs: [{ _id: "mov1" }] });
        mockAuditoriaService.listar.mockResolvedValue([{ _id: "aud1" }]);

        const historico = await service.buscarHistorico("l1");

        expect(mockLoteRepository.buscarPorIdComDetalhes).toHaveBeenCalledWith("l1");
        expect(mockMovimentacaoService.listar).toHaveBeenCalledWith(
            expect.objectContaining({ filtros: { loteId: "l1" } })
        );
        expect(mockAuditoriaService.listar).toHaveBeenCalledWith(
            expect.objectContaining({ filtros: { entidade: AUDITORIA_ENTIDADES.LOTE, entidade_id: 'l1' } }),
            null,
            true
        );
        expect(historico).toHaveProperty("movimentacoes");
        expect(historico).toHaveProperty("auditoria");
        expect(historico.movimentacoes).toHaveLength(1);
        expect(historico.auditoria).toHaveLength(1);
    });
});