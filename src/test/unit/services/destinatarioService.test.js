import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import DestinatarioService from '../../../services/destinatarioService.js';
import CustomError from '../../../utils/helpers/CustomError.js'; 
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../../../constants/auditoria.js';
import { STATUS_DESTINATARIO } from '../../../constants/destinatario.js';

let service;
let mockRepository;
let mockAuditoriaService;

// --- ESTA É A FUNÇÃO QUE ESTAVA FALTANDO ---
const makeDestinatario = (props = {}) => ({
    id: "dest-1",
    nome: "João Silva",
    email: "joao@teste.com",
    documento: "123456789",
    status: STATUS_DESTINATARIO.Ativo,
    ...props // Isso permite sobrescrever campos específicos em cada teste
});

beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
        listar: jest.fn(),
        buscarPorId: jest.fn(),
        buscarPorEmail: jest.fn(),
        buscarPorDocumento: jest.fn(),
        criar: jest.fn(),
        atualizar: jest.fn(),
    };

    mockAuditoriaService = {
        registrar: jest.fn().mockResolvedValue(null),
    };

    service = new DestinatarioService({
        destinatarioRepository: mockRepository,
        auditoriaService: mockAuditoriaService
    });
});

describe("DestinatarioService", () => {
    
    describe("criar", () => {
        it("deve criar o destinatário com status ATIVO e registrar auditoria", async () => {
            const payload = { nome: "João Silva", email: "joao@teste.com", documento: "123456789" };
            
            mockRepository.buscarPorEmail.mockResolvedValue(null);
            mockRepository.buscarPorDocumento.mockResolvedValue(null);
            // Agora a função makeDestinatario existe e o teste vai funcionar!
            mockRepository.criar.mockResolvedValue(makeDestinatario(payload));

            const result = await service.criar(payload, { id: "u1" });

            expect(mockRepository.criar).toHaveBeenCalledWith(
                expect.objectContaining({ status: STATUS_DESTINATARIO.Ativo })
            );
            expect(mockAuditoriaService.registrar).toHaveBeenCalled();
            expect(result).toHaveProperty("id", "dest-1");
        });

        it("deve lançar erro se o e-mail já estiver cadastrado", async () => {
            mockRepository.buscarPorEmail.mockResolvedValue({ id: "outro-id" });

            await expect(service.criar({ email: "jaexiste@test.com" }, { id: "u1" }))
                .rejects.toThrow(CustomError);
        });
    });

    describe("atualizar", () => {
        it("deve atualizar os dados e registrar auditoria", async () => {
            const id = "dest-1";
            mockRepository.buscarPorId.mockResolvedValue(makeDestinatario());
            mockRepository.atualizar.mockResolvedValue(makeDestinatario({ nome: "Nome Alterado" }));

            const result = await service.atualizar(id, { nome: "Nome Alterado" }, { id: "u1" });

            expect(mockRepository.atualizar).toHaveBeenCalledWith(id, { nome: "Nome Alterado" });
            expect(result.nome).toBe("Nome Alterado");
        });
    });

    describe("inativar", () => {
        it("deve alterar o status para Inativo", async () => {
            const id = "dest-1";
            mockRepository.buscarPorId.mockResolvedValue(makeDestinatario());
            
            await service.inativar(id, { id: "u1" });

            expect(mockRepository.atualizar).toHaveBeenCalledWith(id, { 
                status: STATUS_DESTINATARIO.Inativo 
            });
        });
    });

    describe("listar", () => {
        it("deve converter strings de paginação para números", async () => {
            mockRepository.listar.mockResolvedValue({ docs: [] });
            await service.listar({ page: "5", limit: "20" });

            expect(mockRepository.listar).toHaveBeenCalledWith(
                expect.objectContaining({ page: 5, limit: 20 })
            );
        });
    });
});