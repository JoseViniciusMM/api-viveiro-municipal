import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import CustomError from '../../../../src/utils/helpers/CustomError.js';
import { TIPO_USUARIO } from '../../../../src/constants/usuario.js';

const { default: LogAuditoriaService } = await import('../../../../src/services/logAuditoriaService.js');

let service;
let mockLogAuditoriaRepository;

beforeEach(() => {
    jest.clearAllMocks();

    mockLogAuditoriaRepository = {
        registrar: jest.fn(),
        listar: jest.fn(),
    };

    service = new LogAuditoriaService({
        logAuditoriaRepository: mockLogAuditoriaRepository,
    });
});

describe('LogAuditoriaService', () => {
    describe('registrar', () => {
        it('deve registrar auditoria passando o usuario_id como string direta', async () => {
            mockLogAuditoriaRepository.registrar.mockResolvedValue({ _id: 'log1' });

            await service.registrar({ usuario_id: 'u1', acao: 'TESTE', detalhes: { foo: 'bar' } });

            expect(mockLogAuditoriaRepository.registrar).toHaveBeenCalledWith(
                expect.objectContaining({ usuario_id: 'u1', acao: 'TESTE', detalhes_mudanca: { foo: 'bar' } })
            );
        });

        it('não deve lançar exceção e interromper a aplicação se o repositório falhar (deve apenas logar no console)', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            mockLogAuditoriaRepository.registrar.mockRejectedValue(new Error('Falha no MongoDB'));
            
            await service.registrar({ acao: 'TESTE_ERRO' });
            
            expect(consoleSpy).toHaveBeenCalledWith('[PAMINE] Erro ao registrar log de auditoria:', 'Falha no MongoDB');
            consoleSpy.mockRestore();
        });
    });

    describe('listar', () => {
        it('deve listar os logs normalmente se o usuário for Administrador', async () => {
            mockLogAuditoriaRepository.listar.mockResolvedValue({ docs: [] });
            
            await service.listar({}, { cargo: TIPO_USUARIO.Administrador });
            
            expect(mockLogAuditoriaRepository.listar).toHaveBeenCalled();
        });

        it('deve listar os logs burlando a verificação de segurança (bypass) caso isInternal seja true', async () => {
            mockLogAuditoriaRepository.listar.mockResolvedValue({ docs: [] });
            
            await service.listar({}, { cargo: TIPO_USUARIO.Operador }, true);
            
            expect(mockLogAuditoriaRepository.listar).toHaveBeenCalled();
        });

        it('deve lançar erro 403 se o ator for um Operador (sem permissão) e a consulta não for interna', async () => {
            const action = service.listar({}, { cargo: TIPO_USUARIO.Operador }, false);
            
            await expect(action).rejects.toThrow(CustomError);
            await expect(action).rejects.toMatchObject({ 
                statusCode: 403,
                customMessage: 'Acesso negado. Apenas administradores podem visualizar os logs de auditoria globais.'
            });
        });

        it('deve lançar erro 403 se o ator for null (não autenticado) e a consulta não for interna', async () => {
            const action = service.listar({}, null, false);
            
            await expect(action).rejects.toThrow(CustomError);
            await expect(action).rejects.toMatchObject({ 
                statusCode: 403,
                customMessage: 'Acesso negado. Apenas administradores podem visualizar os logs de auditoria globais.'
            });
        });
    });
});