import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import CustomError from '../../../../src/utils/helpers/CustomError.js';
import { STATUS_USUARIO, TIPO_USUARIO } from '../../../../src/constants/usuario.js';
import { AUDITORIA_ACOES } from '../../../../src/constants/auditoria.js';

const { default: TokenService } = await import('../../../../src/services/tokenService.js');
const { default: SessionService } = await import('../../../../src/services/sessionService.js');
const { default: AuthService } = await import('../../../../src/services/authService.js');

describe('Testes de Autenticação (Token, Session e Auth)', () => {
    
    describe('TokenService', () => {
        let tokenService;

        beforeEach(() => {
            tokenService = new TokenService();
        });

        it('deve gerar e verificar um Access Token com o payload correto', () => {
            const data = tokenService.generateAccessToken({ userId: 'u1', papeis: [TIPO_USUARIO.Operador] });
            expect(data).toHaveProperty('token');
            expect(data).toHaveProperty('expiraEm');

            const decoded = tokenService.verifyAccessToken(data.token);
            expect(decoded).toHaveProperty('id', 'u1');
            expect(decoded.papeis).toContain(TIPO_USUARIO.Operador);
        });

        it('deve gerar e verificar um Refresh Token', () => {
            const token = tokenService.generateRefreshToken('u1');
            expect(typeof token).toBe('string');

            const decoded = tokenService.verifyRefreshToken(token);
            expect(decoded).toHaveProperty('id', 'u1');
        });

        it('deve decodificar um token sem verificar a assinatura', () => {
            const data = tokenService.generateAccessToken({ userId: 'u1' });
            const decoded = tokenService.decodeToken(data.token);
            expect(decoded).toHaveProperty('id', 'u1');
        });

        it('deve realizar a introspecção retornando metadados de um token válido', () => {
            const data = tokenService.generateAccessToken({ userId: 'u2' });
            const info = tokenService.introspect(data.token);
            expect(info).toHaveProperty('active', true);
            expect(info).toHaveProperty('client_id', 'u2');
            expect(info).toHaveProperty('token_type', 'Bearer');
        });
    });

    describe('SessionService', () => {
        let sessionService;
        let mockUsuarioRepository;

        beforeEach(() => {
            mockUsuarioRepository = {
                removeToken: jest.fn(),
                buscarPorIdComToken: jest.fn(),
            };
            sessionService = new SessionService({ usuarioRepository: mockUsuarioRepository });
        });

        it('deve revogar o token de um usuário via repository', async () => {
            mockUsuarioRepository.removeToken.mockResolvedValue(true);
            
            const result = await sessionService.revoke('u1');
            
            expect(mockUsuarioRepository.removeToken).toHaveBeenCalledWith('u1');
            expect(result).toBe(true);
        });

        it('deve retornar true se a sessão do usuário estiver ativa (com refreshToken armazenado)', async () => {
            mockUsuarioRepository.buscarPorIdComToken.mockResolvedValue({ refreshtoken: 'valid-token' });
            
            const result = await sessionService.verificarSessaoAtiva('u1');
            
            expect(mockUsuarioRepository.buscarPorIdComToken).toHaveBeenCalledWith('u1');
            expect(result).toBe(true);
        });

        it('deve retornar false se o usuário não possuir refreshToken ativo no banco', async () => {
            mockUsuarioRepository.buscarPorIdComToken.mockResolvedValue({ refreshtoken: null });
            const result = await sessionService.verificarSessaoAtiva('u1');
            expect(result).toBe(false);
        });
    });

    describe('AuthService', () => {
        let authService;
        let mockUsuarioRepository;
        let mockPasswordHasher;
        let mockAuditoriaService;
        let mockTokenService;
        let mockSessionService;
        let mockMailService;

        beforeEach(() => {
            mockUsuarioRepository = {
                buscarPorCpfComSenha: jest.fn(),
                buscarPorEmailComSenha: jest.fn(),
                buscarPorEmail: jest.fn(),
                buscarPorId: jest.fn(),
                buscarPorIdComToken: jest.fn(),
                atualizar: jest.fn(),
            };
            mockPasswordHasher = { comparePassword: jest.fn() };
            mockAuditoriaService = { registrar: jest.fn() };
            mockTokenService = {
                generateRefreshToken: jest.fn(),
                generateAccessToken: jest.fn(),
                verifyRefreshToken: jest.fn(),
            };
            mockSessionService = { revoke: jest.fn() };
            mockMailService = { enviarEmailRecuperacaoSenha: jest.fn() };

            authService = new AuthService({
                usuarioRepository: mockUsuarioRepository,
                passwordHasher: mockPasswordHasher,
                auditoriaService: mockAuditoriaService,
                tokenService: mockTokenService,
                sessionService: mockSessionService,
            });
            authService.mailService = mockMailService;
        });

        describe('login', () => {
            it('deve lançar erro se a senha não for informada no payload de credenciais', async () => {
                await expect(authService.login({ cpf: '123' })).rejects.toThrow(CustomError);
            });

            it('deve lançar erro se o CPF ou Email não forem informados', async () => {
                await expect(authService.login({ senha: '123' })).rejects.toThrow(CustomError);
            });

            it('deve lançar erro de credenciais inválidas se o usuário não for encontrado', async () => {
                mockUsuarioRepository.buscarPorCpfComSenha.mockResolvedValue(null);
                await expect(authService.login({ cpf: '123', senha: '123' })).rejects.toThrow(CustomError);
            });

            it('deve lançar erro bloqueando o acesso de usuário com status Inativo', async () => {
                mockUsuarioRepository.buscarPorCpfComSenha.mockResolvedValue({ status: STATUS_USUARIO.Inativo });
                await expect(authService.login({ cpf: '123', senha: '123' })).rejects.toThrow(CustomError);
            });

            it('deve lançar erro bloqueando o acesso de usuário com status Pendente (aguardando ativação)', async () => {
                mockUsuarioRepository.buscarPorCpfComSenha.mockResolvedValue({ status: STATUS_USUARIO.Pendente });
                await expect(authService.login({ cpf: '123', senha: '123' })).rejects.toThrow(CustomError);
            });

            it('deve lançar erro de credenciais inválidas se a senha estiver errada', async () => {
                mockUsuarioRepository.buscarPorCpfComSenha.mockResolvedValue({ status: STATUS_USUARIO.Ativo, senha: 'hashed' });
                mockPasswordHasher.comparePassword.mockResolvedValue(false);
                await expect(authService.login({ cpf: '123', senha: 'wrong' })).rejects.toThrow(CustomError);
            });

            it('deve realizar login com sucesso e retornar tokens via CPF', async () => {
                const mockUser = { _id: 'u1', nome: 'Teste', cargo: TIPO_USUARIO.Operador, status: STATUS_USUARIO.Ativo, senha: 'hashed' };
                mockUsuarioRepository.buscarPorCpfComSenha.mockResolvedValue(mockUser);
                mockPasswordHasher.comparePassword.mockResolvedValue(true);
                
                mockTokenService.generateRefreshToken.mockReturnValue('refresh123');
                mockTokenService.generateAccessToken.mockReturnValue({ token: 'access123', expiraEm: '2099-01-01T00:00:00Z' });

                const result = await authService.login({ cpf: '123.456', senha: '123' });

                expect(mockUsuarioRepository.atualizar).toHaveBeenCalledWith('u1', { refreshtoken: 'refresh123' });
                expect(mockUsuarioRepository.atualizar).toHaveBeenCalledWith('u1', { ultimoLoginEm: expect.any(Date) });
                expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(expect.objectContaining({ acao: AUDITORIA_ACOES.LOGIN }));
                expect(result).toHaveProperty('accessToken', 'access123');
                expect(result.usuario).toHaveProperty('id', 'u1');
            });

            it('deve realizar login com sucesso e retornar tokens via EMAIL', async () => {
                const mockUser = { _id: 'u2', nome: 'Teste', cargo: TIPO_USUARIO.Administrador, status: STATUS_USUARIO.Ativo, senha: 'hashed' };
                mockUsuarioRepository.buscarPorEmailComSenha.mockResolvedValue(mockUser);
                mockPasswordHasher.comparePassword.mockResolvedValue(true);
                
                mockTokenService.generateRefreshToken.mockReturnValue('refresh123');
                mockTokenService.generateAccessToken.mockReturnValue({ token: 'access123', expiraEm: '2099-01-01T00:00:00Z' });

                const result = await authService.login({ email: 'admin@gov.br', senha: '123' });

                expect(mockUsuarioRepository.buscarPorEmailComSenha).toHaveBeenCalledWith('admin@gov.br');
                expect(result).toHaveProperty('accessToken', 'access123');
                expect(result.usuario).toHaveProperty('id', 'u2');
            });
        });

        describe('logout', () => {
            it('deve revogar a sessão do usuário via sessionService e registrar a auditoria', async () => {
                await authService.logout('u1');
                
                expect(mockSessionService.revoke).toHaveBeenCalledWith('u1');
                expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(expect.objectContaining({ acao: AUDITORIA_ACOES.LOGOUT }));
            });
        });

        describe('refreshToken', () => {
            it('deve lançar erro se o refresh token não coincidir com o banco de dados', async () => {
                mockTokenService.verifyRefreshToken.mockReturnValue({ id: 'u1' });
                mockUsuarioRepository.buscarPorIdComToken.mockResolvedValue({ _id: 'u1', refreshtoken: 'old-rt', status: STATUS_USUARIO.Ativo });

                await expect(authService.refreshToken('new-rt')).rejects.toThrow(CustomError);
            });

            it('deve lançar erro se o usuário estiver inativo no ato de revalidar o token', async () => {
                mockTokenService.verifyRefreshToken.mockReturnValue({ id: 'u1' });
                mockUsuarioRepository.buscarPorIdComToken.mockResolvedValue({ _id: 'u1', refreshtoken: 'rt1', status: STATUS_USUARIO.Inativo });

                await expect(authService.refreshToken('rt1')).rejects.toThrow(CustomError);
            });

            it('deve gerar um novo access token se as validações passarem', async () => {
                mockTokenService.verifyRefreshToken.mockReturnValue({ id: 'u1' });
                mockUsuarioRepository.buscarPorIdComToken.mockResolvedValue({ _id: 'u1', refreshtoken: 'rt1', status: STATUS_USUARIO.Ativo, cargo: TIPO_USUARIO.Operador });
                mockTokenService.generateAccessToken.mockReturnValue({ token: 'new-at', expiraEm: 'new-date' });

                const result = await authService.refreshToken('rt1');

                expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith({ userId: 'u1', papeis: [TIPO_USUARIO.Operador] });
                expect(result).toHaveProperty('accessToken', 'new-at');
            });
        });

        describe('esqueceuSenha', () => {
            it('não deve fazer nada se o e-mail solicitado não existir no sistema', async () => {
                mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);
                
                await authService.esqueceuSenha('naoexiste@gov.br');
                
                expect(mockMailService.enviarEmailRecuperacaoSenha).not.toHaveBeenCalled();
            });

            it('deve enviar o e-mail de recuperação e registrar no log se o usuário existir', async () => {
                mockUsuarioRepository.buscarPorEmail.mockResolvedValue({ _id: 'u1', email: 'joao@gov.br', nome: 'Joao' });
                
                await authService.esqueceuSenha('joao@gov.br');

                expect(mockMailService.enviarEmailRecuperacaoSenha).toHaveBeenCalledWith('joao@gov.br', { nome: 'Joao' });
                expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(expect.objectContaining({ acao: AUDITORIA_ACOES.RESETAR_SENHA }));
            });

            it('deve capturar erro do mailService sem interromper o fluxo e registrar auditoria', async () => {
                const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
                mockUsuarioRepository.buscarPorEmail.mockResolvedValue({ _id: 'u1', email: 'joao@gov.br', nome: 'Joao' });
                mockMailService.enviarEmailRecuperacaoSenha.mockRejectedValue(new Error('Falha no SMTP'));
                
                await authService.esqueceuSenha('joao@gov.br');

                expect(consoleSpy).toHaveBeenCalledWith('[PAMINE] Falha ao enviar e-mail de recuperação:', 'Falha no SMTP');
                expect(mockAuditoriaService.registrar).toHaveBeenCalled();
                consoleSpy.mockRestore();
            });
        });
    });
});
