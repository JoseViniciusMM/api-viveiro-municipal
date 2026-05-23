import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import EstufaService from '../../../services/estufaService.js';
import CustomError from '../../../utils/helpers/CustomError.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../../../constants/auditoria.js';
import { STATUS_ESTUFA } from '../../../constants/estufa.js';

let service;
let mockEstufaRepository;
let mockAuditoriaService;
let mockLoteRepository;

// Factory para facilitar a criação de objetos de Estufa nos testes
const makeEstufa = (props = {}) => ({
    id: "est-1",
    codigo_identificador: "E01-B01-01",
    localizacao_estufa: 1,
    localizacao_barraca: 1,
    localizacao_posicao: 1,
    capacidade_total: 1000,
    status: STATUS_ESTUFA.Livre,
    ...props
});

beforeEach(() => {
    jest.clearAllMocks();

    mockEstufaRepository = {
        listar: jest.fn(),
        buscarPorId: jest.fn(),
        buscarPorCodigo: jest.fn(),
        criar: jest.fn(),
        atualizar: jest.fn(),
    };

    mockAuditoriaService = {
        registrar: jest.fn().mockResolvedValue(null),
    };

    mockLoteRepository = {
        buscarAtivosPorEstufa: jest.fn()
    };

    service = new EstufaService({
        estufaRepository: mockEstufaRepository,
        auditoriaService: mockAuditoriaService,
        loteRepository: mockLoteRepository
    });
});

describe("EstufaService", () => {

    describe("criar", () => {
        it("deve gerar o código identificador (E01-B05-10) automaticamente e criar a estufa", async () => {
            const payload = { 
                localizacao_estufa: 1, 
                localizacao_barraca: 5, 
                localizacao_posicao: 10, 
                capacidade_total: 500 
            };
            
            mockEstufaRepository.buscarPorCodigo.mockResolvedValue(null);
            mockEstufaRepository.criar.mockResolvedValue(makeEstufa({ id: "est-new", ...payload, codigo_identificador: "E01-B05-10" }));

            const result = await service.criar(payload, { id: "u1" });

            // Verifica se a lógica de preenchimento de zeros (padStart) funcionou
            expect(mockEstufaRepository.criar).toHaveBeenCalledWith(
                expect.objectContaining({ codigo_identificador: "E01-B05-10" })
            );
            expect(mockAuditoriaService.registrar).toHaveBeenCalled();
            expect(result.id).toBe("est-new");
        });

        it("deve lançar erro se a posição (código) já estiver ocupada por outra estufa", async () => {
            mockEstufaRepository.buscarPorCodigo.mockResolvedValue({ id: "outra-estufa" });
            
            const action = service.criar({ 
                localizacao_estufa: 1, localizacao_barraca: 1, localizacao_posicao: 1, capacidade_total: 100 
            }, { id: "u1" });
            
            await expect(action).rejects.toThrow(CustomError);
        });
    });

    describe("atualizar", () => {
        it("deve impedir redução de capacidade se a nova capacidade for menor que o total de mudas nos lotes ativos", async () => {
            const estufaOriginal = makeEstufa({ capacidade_total: 1000 });
            mockEstufaRepository.buscarPorId.mockResolvedValue(estufaOriginal);
            
            // Simula ocupação de 800 mudas (200 + 600)
            mockLoteRepository.buscarAtivosPorEstufa.mockResolvedValue([
                { itens_especies: [{ quantidade_atual: 200 }] },
                { itens_especies: [{ quantidade_atual: 600 }] }
            ]);

            // Tentar reduzir para 500 (vai dar erro pois 500 < 800)
            const action = service.atualizar("est-1", { capacidade_total: 500 }, { id: "u1" });

            await expect(action).rejects.toMatchObject({ statusCode: 400 });
            expect(mockEstufaRepository.atualizar).not.toHaveBeenCalled();
        });
    });

    describe("inativar", () => {
        it("deve bloquear a inativação se a estufa ainda tiver lotes ativos", async () => {
            mockEstufaRepository.buscarPorId.mockResolvedValue(makeEstufa());
            mockLoteRepository.buscarAtivosPorEstufa.mockResolvedValue([{ id: "lote-qualquer" }]);

            const action = service.inativar("est-1", { id: "u1" });

            await expect(action).rejects.toThrow(CustomError);
            expect(mockEstufaRepository.atualizar).not.toHaveBeenCalled();
        });

        it("deve inativar com sucesso se não houver lotes vinculados", async () => {
            mockEstufaRepository.buscarPorId.mockResolvedValue(makeEstufa());
            mockLoteRepository.buscarAtivosPorEstufa.mockResolvedValue([]);

            await service.inativar("est-1", { id: "u1" });

            expect(mockEstufaRepository.atualizar).toHaveBeenCalledWith("est-1", { 
                status: STATUS_ESTUFA.Inativo 
            });
        });
    });

    describe("listar", () => {
        it("deve tratar corretamente os parâmetros de paginação", async () => {
            mockEstufaRepository.listar.mockResolvedValue({ docs: [] });
            await service.listar({ page: "1", limit: "10" });

            expect(mockEstufaRepository.listar).toHaveBeenCalledWith(
                expect.objectContaining({ page: 1, limit: 10 })
            );
        });
    });
});