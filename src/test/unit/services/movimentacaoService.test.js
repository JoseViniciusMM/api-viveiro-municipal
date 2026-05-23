import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import CustomError from '../../../../src/utils/helpers/CustomError.js';
import { TIPO_MOVIMENTACAO } from '../../../../src/constants/movimentacao.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../../../../src/constants/auditoria.js';
import { STATUS_DESTINATARIO } from '../../../../src/constants/destinatario.js';
import { STATUS } from '../../../../src/constants/lote.js';

const { default: MovimentacaoService } = await import('../../../../src/services/movimentacaoService.js');

let service;
let mockMovimentacaoRepository;
let mockEspecieRepository;
let mockLoteRepository;
let mockDestinatarioRepository;
let mockAuditoriaService;

const makeMovimentacao = (props = {}) => ({
    _id: "m1",
    especie_id: "e1",
    tipo: TIPO_MOVIMENTACAO.Entrada,
    quantidade: 50,
    justificativa: "Movimentacao de teste",
    usuario_id: "u1",
    ...props
});

beforeEach(() => {
    jest.clearAllMocks();

    mockMovimentacaoRepository = {
        criar: jest.fn(),
        listar: jest.fn(),
        buscarPorId: jest.fn()
    };

    mockEspecieRepository = {
        buscarPorId: jest.fn(),
        atualizar: jest.fn()
    };

    mockLoteRepository = {
        buscarPorId: jest.fn(),
        atualizar: jest.fn()
    };

    mockDestinatarioRepository = { 
        buscarPorId: jest.fn() 
    };

    mockAuditoriaService = { 
        registrar: jest.fn().mockResolvedValue(null) 
    };

    service = new MovimentacaoService({
        movimentacaoRepository: mockMovimentacaoRepository,
        especieRepository: mockEspecieRepository,
        loteRepository: mockLoteRepository,
        destinatarioRepository: mockDestinatarioRepository,
        auditoriaService: mockAuditoriaService
    });
});

describe("criar", () => {
    it("deve registrar ENTRADA e incrementar o saldo da sementeira", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 100 });
        mockMovimentacaoRepository.criar.mockResolvedValue(makeMovimentacao());

        const data = await service.criar({
            especie_id: "e1",
            tipo: TIPO_MOVIMENTACAO.Entrada,
            quantidade: 50,
            justificativa: "Recebimento"
        }, { id: "u1" });

        expect(mockEspecieRepository.buscarPorId).toHaveBeenCalledWith("e1");
        expect(mockEspecieRepository.atualizar).toHaveBeenCalledWith("e1", { quantidade_atual: 150 });
        expect(mockMovimentacaoRepository.criar).toHaveBeenCalledWith(
            expect.objectContaining({ tipo: TIPO_MOVIMENTACAO.Entrada, quantidade: 50 })
        );
        expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(
            expect.objectContaining({
                acao: AUDITORIA_ACOES.CRIAR_MOVIMENTACAO,
                entidade: AUDITORIA_ENTIDADES.MOVIMENTACAO
            })
        );
        expect(data).toHaveProperty("_id", "m1");
    });

    it("deve registrar SAÍDA e decrementar o saldo da sementeira", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 100 });
        mockMovimentacaoRepository.criar.mockResolvedValue(makeMovimentacao({ tipo: TIPO_MOVIMENTACAO.Saida }));

        await service.criar({
            especie_id: "e1",
            tipo: TIPO_MOVIMENTACAO.Saida,
            quantidade: 30,
            justificativa: "Uso interno"
        }, { id: "u1" });

        expect(mockEspecieRepository.atualizar).toHaveBeenCalledWith("e1", { quantidade_atual: 70 });
        expect(mockMovimentacaoRepository.criar).toHaveBeenCalledWith(
            expect.objectContaining({ tipo: TIPO_MOVIMENTACAO.Saida, quantidade: 30 })
        );
    });

    it("deve lançar erro ao tentar movimentar uma espécie inexistente", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue(null);

        const action = service.criar({
            especie_id: "eInvalida",
            tipo: TIPO_MOVIMENTACAO.Entrada,
            quantidade: 10
        }, { id: "u1" });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: "Espécie não encontrada" });
    });

    it("deve lançar erro ao tentar retirar uma quantidade maior que o saldo da sementeira", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 20 });

        const action = service.criar({
            especie_id: "e1",
            tipo: TIPO_MOVIMENTACAO.Saida,
            quantidade: 50,
            justificativa: "Uso excessivo"
        }, { id: "u1" });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: "Saldo insuficiente na sementeira" });
    });

    it("deve lançar erro ao registrar EXPEDIÇÃO com um destinatário inexistente", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 100 });
        mockLoteRepository.buscarPorId.mockResolvedValue({ 
            _id: "l1", 
            itens_especies: [{ especie_id: "e1", quantidade_atual: 50 }] 
        });
        mockDestinatarioRepository.buscarPorId.mockResolvedValue(null);

        const action = service.criar({
            especie_id: "e1",
            lote_id: "l1",
            destinatario_id: "d1",
            tipo: TIPO_MOVIMENTACAO.Expedicao,
            quantidade: 10
        }, { id: "u1" });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: "Destinatário inválido ou inativo" });
    });

    it("deve lançar erro ao registrar EXPEDIÇÃO caso o destinatário esteja inativo", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 100 });
        mockLoteRepository.buscarPorId.mockResolvedValue({ 
            _id: "l1", 
            itens_especies: [{ especie_id: "e1", quantidade_atual: 50 }] 
        });
        mockDestinatarioRepository.buscarPorId.mockResolvedValue({ _id: "d1", status: "Inativo" });

        const action = service.criar({
            especie_id: "e1",
            lote_id: "l1",
            destinatario_id: "d1",
            tipo: TIPO_MOVIMENTACAO.Expedicao,
            quantidade: 10
        }, { id: "u1" });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: "Destinatário inválido ou inativo" });
    });

    it("deve registrar MORTALIDADE abatendo o saldo apenas do lote afetado", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 500 });
        mockLoteRepository.buscarPorId.mockResolvedValue({ 
            _id: "l1", 
            itens_especies: [{ especie_id: "e1", quantidade_atual: 200 }] 
        });
        mockMovimentacaoRepository.criar.mockResolvedValue(makeMovimentacao({ tipo: TIPO_MOVIMENTACAO.Mortalidade }));

        await service.criar({
            especie_id: "e1",
            lote_id: "l1",
            tipo: TIPO_MOVIMENTACAO.Mortalidade,
            quantidade: 15,
            justificativa: "Praga na estufa"
        }, { id: "u1" });

        expect(mockEspecieRepository.atualizar).not.toHaveBeenCalled();
        expect(mockLoteRepository.atualizar).toHaveBeenCalledWith("l1", { 
            itens_especies: [{ especie_id: "e1", quantidade_atual: 185 }]
        });
        expect(mockMovimentacaoRepository.criar).toHaveBeenCalledWith(
            expect.objectContaining({ tipo: TIPO_MOVIMENTACAO.Mortalidade, quantidade: 15 })
        );
    });

    it("deve lançar erro ao registrar EXPEDIÇÃO ou MORTALIDADE sem informar o lote", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 100 });

        const action = service.criar({
            especie_id: "e1",
            tipo: TIPO_MOVIMENTACAO.Mortalidade,
            quantidade: 10
        }, { id: "u1" });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: "ID do Lote é obrigatório para este tipo" });
    });

    it("deve lançar erro ao tentar abater mudas de um lote inexistente", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 100 });
        mockLoteRepository.buscarPorId.mockResolvedValue(null);

        const action = service.criar({
            especie_id: "e1",
            lote_id: "loteInvalido",
            tipo: TIPO_MOVIMENTACAO.Mortalidade,
            quantidade: 10
        }, { id: "u1" });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: "Lote não encontrado" });
    });

    it("deve lançar erro ao registrar EXPEDIÇÃO sem informar o destinatário", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 100 });
        mockLoteRepository.buscarPorId.mockResolvedValue({ 
            _id: "l1", 
            itens_especies: [{ especie_id: "e1", quantidade_atual: 100 }] 
        });

        const action = service.criar({
            especie_id: "e1",
            lote_id: "l1",
            tipo: TIPO_MOVIMENTACAO.Expedicao,
            quantidade: 10
        }, { id: "u1" });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: "Destinatário obrigatório para expedição" });
    });

    it("deve registrar EXPEDIÇÃO com sucesso, abatendo o saldo exclusivamente do lote", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 100 });
        mockLoteRepository.buscarPorId.mockResolvedValue({ 
            _id: "l1", 
            itens_especies: [{ especie_id: "e1", quantidade_atual: 100 }] 
        });
        mockDestinatarioRepository.buscarPorId.mockResolvedValue({ _id: "d1", status: STATUS_DESTINATARIO.Ativo });
        mockMovimentacaoRepository.criar.mockResolvedValue(makeMovimentacao({ tipo: TIPO_MOVIMENTACAO.Expedicao }));

        await service.criar({
            especie_id: "e1",
            lote_id: "l1",
            destinatario_id: "d1",
            tipo: TIPO_MOVIMENTACAO.Expedicao,
            quantidade: 20
        }, { id: "u1" });

        expect(mockEspecieRepository.atualizar).not.toHaveBeenCalled();
        expect(mockLoteRepository.atualizar).toHaveBeenCalledWith("l1", { 
            itens_especies: [{ especie_id: "e1", quantidade_atual: 80 }]
        });
        expect(mockMovimentacaoRepository.criar).toHaveBeenCalledWith(
            expect.objectContaining({ tipo: TIPO_MOVIMENTACAO.Expedicao, quantidade: 20 })
        );
        expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(
            expect.objectContaining({ acao: AUDITORIA_ACOES.CRIAR_MOVIMENTACAO })
        );
    });

    it("deve registrar AJUSTE atualizando o saldo da sementeira corretamente", async () => {
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 100 });
        mockMovimentacaoRepository.criar.mockResolvedValue(makeMovimentacao({ tipo: TIPO_MOVIMENTACAO.Ajuste }));

        await service.criar({
            especie_id: "e1",
            tipo: TIPO_MOVIMENTACAO.Ajuste,
            quantidade: 20
        }, { id: "u1" });

        expect(mockEspecieRepository.atualizar).toHaveBeenCalledWith("e1", { quantidade_atual: 120 });
    });
});

describe("buscarPorId", () => {
    it("deve retornar os detalhes da movimentação correspondente ao ID informado", async () => {
        const id = "m1";
        mockMovimentacaoRepository.buscarPorId.mockResolvedValue(makeMovimentacao());

        const result = await service.buscarPorId(id);

        expect(mockMovimentacaoRepository.buscarPorId).toHaveBeenCalledWith(id);
        expect(result).toHaveProperty("_id", "m1");
    });

    it("deve lançar erro ao buscar um ID de movimentação inexistente", async () => {
        mockMovimentacaoRepository.buscarPorId.mockResolvedValue(null);

        await expect(service.buscarPorId("invalid_id")).rejects.toThrow(CustomError);
    });
});

describe("listar", () => {
    it("deve listar as movimentações aplicando os filtros e paginação informados", async () => {
        const movimentacao = { filtros: { tipo: TIPO_MOVIMENTACAO.Entrada }, page: 2, limit: 20 };
        const response = { docs: [makeMovimentacao()], totalDocs: 1, page: 2 };
        
        mockMovimentacaoRepository.listar.mockResolvedValue(response);

        const result = await service.listar(movimentacao);

        expect(mockMovimentacaoRepository.listar).toHaveBeenCalledWith(movimentacao);
        expect(result.docs).toHaveLength(1);
    });

    it("deve aplicar os parâmetros de paginação padrão caso a requisição venha vazia", async () => {
        mockMovimentacaoRepository.listar.mockResolvedValue({ docs: [], totalDocs: 0 });

        await service.listar({});

        expect(mockMovimentacaoRepository.listar).toHaveBeenCalledWith(
            expect.objectContaining({ page: 1, limit: 20 })
        );
    });
});

describe("estornar", () => {
    it("deve estornar a movimentação e reverter corretamente o saldo físico da sementeira", async () => {
        mockMovimentacaoRepository.buscarPorId.mockResolvedValue(makeMovimentacao({ 
            _id: "mOriginal", tipo: TIPO_MOVIMENTACAO.Entrada, quantidade: 100 
        }));
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 150 });
        mockMovimentacaoRepository.criar.mockResolvedValue(makeMovimentacao({ _id: "mEstorno", tipo: TIPO_MOVIMENTACAO.Estorno }));

        const result = await service.estornar("mOriginal", { id: "u1" });

        expect(mockEspecieRepository.atualizar).toHaveBeenCalledWith("e1", { quantidade_atual: 50 });
        expect(mockMovimentacaoRepository.criar).toHaveBeenCalledWith(expect.objectContaining({
            tipo: TIPO_MOVIMENTACAO.Estorno,
            quantidade: 100,
            justificativa: expect.stringContaining("mOriginal")
        }));
        expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(
            expect.objectContaining({
                acao: AUDITORIA_ACOES.ESTORNAR_MOVIMENTACAO,
                entidade: AUDITORIA_ENTIDADES.MOVIMENTACAO
            })
        );
        expect(result).toHaveProperty("_id", "mEstorno");
    });

    it("deve bloquear o estorno caso a reversão deixe o saldo da sementeira negativo", async () => {
        mockMovimentacaoRepository.buscarPorId.mockResolvedValue(makeMovimentacao({ 
            _id: "mOriginal", tipo: TIPO_MOVIMENTACAO.Entrada, quantidade: 100 
        }));
        mockEspecieRepository.buscarPorId.mockResolvedValue({ _id: "e1", quantidade_atual: 50 });

        const action = service.estornar("mOriginal", { id: "u1" });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: 'Estorno não permitido: o saldo da sementeira ficaria negativo.' });
    });

    it("deve estornar uma baixa de estufa revertendo o saldo apenas no lote (sem afetar a sementeira)", async () => {
        mockMovimentacaoRepository.buscarPorId.mockResolvedValue(makeMovimentacao({ 
            _id: "mOriginal", tipo: TIPO_MOVIMENTACAO.Expedicao, quantidade: 20, lote_id: "l1"
        }));
        mockLoteRepository.buscarPorId.mockResolvedValue({ 
            _id: "l1", 
            status: STATUS.Ativo,
            itens_especies: [{ especie_id: "e1", quantidade_atual: 80 }] 
        });
        mockMovimentacaoRepository.criar.mockResolvedValue(makeMovimentacao({ _id: "mEstorno", tipo: TIPO_MOVIMENTACAO.Estorno }));

        await service.estornar("mOriginal", { id: "u1" });

        expect(mockEspecieRepository.atualizar).not.toHaveBeenCalled();
        expect(mockLoteRepository.atualizar).toHaveBeenCalledWith("l1", {
            itens_especies: [{ especie_id: "e1", quantidade_atual: 100 }]
        });
    });

    it("deve bloquear o estorno direto de uma SAÍDA que foi utilizada na criação de um lote", async () => {
        mockMovimentacaoRepository.buscarPorId.mockResolvedValue(makeMovimentacao({ 
            _id: "mOriginal", tipo: TIPO_MOVIMENTACAO.Saida, quantidade: 200, lote_id: "l1" 
        }));

        const action = service.estornar("mOriginal", { id: "u1" });
        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: 'Não é possível estornar uma saída de alocação de lote diretamente. Cancele o lote.' });
    });

    it("deve bloquear o estorno se o lote vinculado já estiver finalizado ou inativo", async () => {
        mockMovimentacaoRepository.buscarPorId.mockResolvedValue(makeMovimentacao({ 
            _id: "mOriginal", tipo: TIPO_MOVIMENTACAO.Expedicao, quantidade: 20, lote_id: "l1"
        }));
        mockLoteRepository.buscarPorId.mockResolvedValue({ 
            _id: "l1", 
            status: STATUS.Inativo,
            itens_especies: [{ especie_id: "e1", quantidade_atual: 80 }] 
        });

        const action = service.estornar("mOriginal", { id: "u1" });
        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: 'Estorno não permitido: o lote atrelado encontra-se inativo ou finalizado.' });
    });
});
