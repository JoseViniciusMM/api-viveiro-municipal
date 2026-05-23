import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import CustomError from '../../../../src/utils/helpers/CustomError.js';
import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from '../../../../src/constants/auditoria.js';

const { default: UsuarioService } = await import('../../../../src/services/usuarioService.js');

let service;
let mockUsuarioRepository;
let mockPasswordHasher;
let mockAuditoriaService;

const makeUsuario = (props = {}) => ({
    _id: 'u1',
    nome: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@viveiro.gov.br',
    telefone: '(92) 99999-0001',
    cargo: 'OPERADOR',
    status: 'ATIVO',
    token_ativacao: null,
    token_ativacao_expira: null,
    toObject: () => ({ _id: 'u1', nome: 'João Silva', cargo: 'OPERADOR', status: 'ATIVO' }),
    ...props,
});

beforeEach(() => {
    jest.clearAllMocks();

    mockUsuarioRepository = {
        criar: jest.fn(),
        listar: jest.fn(),
        buscarPorId: jest.fn(),
        buscarPorEmail: jest.fn(),
        buscarPorCpf: jest.fn(),
        buscarPorTokenAtivacao: jest.fn(),
        atualizar: jest.fn(),
    };

    mockPasswordHasher = {
        hashPassword: jest.fn().mockResolvedValue('hash_senha_segura'),
        comparePassword: jest.fn(),
    };

    mockAuditoriaService = {
        registrar: jest.fn().mockResolvedValue(null),
    };

    service = new UsuarioService({
        usuarioRepository: mockUsuarioRepository,
        passwordHasher: mockPasswordHasher,
        auditoriaService: mockAuditoriaService,
        tokenService: null,
        mailService: null,
    });
});

describe('criar', () => {
    it('deve criar o usuário com status ATIVO quando a senha é fornecida', async () => {
        mockUsuarioRepository.buscarPorCpf.mockResolvedValue(null);
        mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);
        mockUsuarioRepository.criar.mockResolvedValue(makeUsuario({ status: 'ATIVO' }));

        const payload = {
            nome: 'João Silva',
            cpf: '123.456.789-00',
            email: 'joao@viveiro.gov.br',
            cargo: 'OPERADOR',
            senha: 'Senha@123',
        };

        const result = await service.criar(payload, { id: 'admin1' });

        expect(mockPasswordHasher.hashPassword).toHaveBeenCalledWith('Senha@123');
        expect(mockUsuarioRepository.criar).toHaveBeenCalledWith(
            expect.objectContaining({ status: 'ATIVO' })
        );
        expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(
            expect.objectContaining({ acao: AUDITORIA_ACOES.CRIAR_USUARIO })
        );
        expect(result).toHaveProperty('_id', 'u1');
    });

    it('deve criar o usuário com status PENDENTE quando a senha não é fornecida', async () => {
        mockUsuarioRepository.buscarPorCpf.mockResolvedValue(null);
        mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);
        mockUsuarioRepository.criar.mockResolvedValue(makeUsuario({ status: 'PENDENTE' }));

        const payload = {
            nome: 'Maria Souza',
            cpf: '000.000.000-00',
            email: 'maria@viveiro.gov.br',
            cargo: 'OPERADOR',
        };

        const result = await service.criar(payload, { id: 'admin1' });

        expect(mockUsuarioRepository.criar).toHaveBeenCalledWith(
            expect.objectContaining({ status: 'PENDENTE' })
        );
        expect(result).toHaveProperty('status', 'PENDENTE');
    });

    it('deve lançar erro ao tentar criar usuário com CPF já cadastrado', async () => {
        mockUsuarioRepository.buscarPorCpf.mockResolvedValue(makeUsuario());

        const action = service.criar({ cpf: '123.456.789-00', email: 'novo@email.com' }, { id: 'admin1' });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: 'CPF já cadastrado no sistema' });
        expect(mockUsuarioRepository.criar).not.toHaveBeenCalled();
    });

    it('deve lançar erro ao tentar criar usuário com e-mail já cadastrado', async () => {
        mockUsuarioRepository.buscarPorCpf.mockResolvedValue(null);
        mockUsuarioRepository.buscarPorEmail.mockResolvedValue(makeUsuario());

        const action = service.criar({ cpf: '999.999.999-99', email: 'joao@viveiro.gov.br' }, { id: 'admin1' });

        await expect(action).rejects.toThrow(CustomError);
        await expect(action).rejects.toMatchObject({ customMessage: 'Email já está em uso' });
        expect(mockUsuarioRepository.criar).not.toHaveBeenCalled();
    });
});

describe('buscarPorId', () => {
    it('deve retornar o usuário correspondente ao ID informado', async () => {
        mockUsuarioRepository.buscarPorId.mockResolvedValue(makeUsuario());

        const result = await service.buscarPorId('u1');

        expect(mockUsuarioRepository.buscarPorId).toHaveBeenCalledWith('u1');
        expect(result).toHaveProperty('_id', 'u1');
    });

    it('deve lançar erro ao tentar buscar um ID de usuário inexistente', async () => {
        mockUsuarioRepository.buscarPorId.mockResolvedValue(null);

        await expect(service.buscarPorId('id_invalido')).rejects.toThrow(CustomError);
        await expect(service.buscarPorId('id_invalido')).rejects.toMatchObject({ statusCode: 404 });
    });
});

describe('listar', () => {
    it('deve listar os usuários aplicando corretamente os parâmetros de filtro e paginação', async () => {
        mockUsuarioRepository.listar.mockResolvedValue({ docs: [], totalDocs: 0 });

        await service.listar({ filtros: { cargo: 'OPERADOR' }, page: 1, limit: 10 });

        expect(mockUsuarioRepository.listar).toHaveBeenCalledWith(
            expect.objectContaining({ filtros: { cargo: 'OPERADOR' }, page: 1, limit: 10 })
        );
    });
});

describe('atualizar', () => {
    it('deve atualizar os dados do usuário e registrar auditoria', async () => {
        mockUsuarioRepository.buscarPorId.mockResolvedValue(makeUsuario());
        mockUsuarioRepository.atualizar.mockResolvedValue(makeUsuario({ nome: 'João Atualizado' }));

        const result = await service.atualizar('u1', { nome: 'João Atualizado' }, { id: 'admin1' });

        expect(mockUsuarioRepository.atualizar).toHaveBeenCalledWith('u1', expect.objectContaining({ nome: 'João Atualizado' }));
        expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(
            expect.objectContaining({ acao: AUDITORIA_ACOES.ATUALIZAR_USUARIO })
        );
        expect(result).toHaveProperty('nome', 'João Atualizado');
    });

    it('deve fazer hash da nova senha quando ela for fornecida na atualização', async () => {
        mockUsuarioRepository.buscarPorId.mockResolvedValue(makeUsuario());
        mockUsuarioRepository.atualizar.mockResolvedValue(makeUsuario());

        await service.atualizar('u1', { senha: 'NovaSenha@123' }, { id: 'admin1' });

        expect(mockPasswordHasher.hashPassword).toHaveBeenCalledWith('NovaSenha@123');
        expect(mockUsuarioRepository.atualizar).toHaveBeenCalledWith('u1',
            expect.objectContaining({ senha: 'hash_senha_segura' })
        );
    });

    it('deve lançar erro ao tentar atualizar um usuário inexistente', async () => {
        mockUsuarioRepository.buscarPorId.mockResolvedValue(null);

        await expect(service.atualizar('id_invalido', { nome: 'X' }, { id: 'admin1' })).rejects.toThrow(CustomError);
        expect(mockUsuarioRepository.atualizar).not.toHaveBeenCalled();
    });
});

describe('inativar', () => {
    it('deve inativar o usuário alterando o status para INATIVO e registrar auditoria', async () => {
        mockUsuarioRepository.buscarPorId.mockResolvedValue(makeUsuario());
        mockUsuarioRepository.atualizar.mockResolvedValue(makeUsuario({ status: 'INATIVO' }));

        await service.inativar('u1', { id: 'admin1' });

        expect(mockUsuarioRepository.atualizar).toHaveBeenCalledWith('u1', { status: 'INATIVO' });
        expect(mockAuditoriaService.registrar).toHaveBeenCalledWith(
            expect.objectContaining({ acao: AUDITORIA_ACOES.INATIVAR_USUARIO })
        );
    });

    it('deve lançar erro ao tentar inativar um usuário inexistente', async () => {
        mockUsuarioRepository.buscarPorId.mockResolvedValue(null);

        await expect(service.inativar('id_invalido', { id: 'admin1' })).rejects.toThrow(CustomError);
        expect(mockUsuarioRepository.atualizar).not.toHaveBeenCalled();
    });
});

describe('confirmarCadastro', () => {
    it('deve ativar a conta do usuário com status ATIVO ao confirmar com token válido', async () => {
        mockUsuarioRepository.buscarPorTokenAtivacao.mockResolvedValue(
            makeUsuario({
                token_ativacao: 'token_valido',
                token_ativacao_expira: new Date(Date.now() + 60 * 60 * 1000),
            })
        );
        mockUsuarioRepository.atualizar.mockResolvedValue(makeUsuario({ status: 'ATIVO' }));

        const result = await service.confirmarCadastro('token_valido', 'Senha@123');

        expect(mockPasswordHasher.hashPassword).toHaveBeenCalledWith('Senha@123');
        expect(mockUsuarioRepository.atualizar).toHaveBeenCalledWith(
            'u1',
            expect.objectContaining({ status: 'ATIVO', token_ativacao: null })
        );
        expect(result).toHaveProperty('status', 'ATIVO');
    });

    it('deve lançar erro ao confirmar cadastro com token inválido', async () => {
        mockUsuarioRepository.buscarPorTokenAtivacao.mockResolvedValue(null);

        await expect(service.confirmarCadastro('token_invalido', 'Senha@123')).rejects.toThrow(CustomError);
        await expect(service.confirmarCadastro('token_invalido', 'Senha@123')).rejects.toMatchObject({ statusCode: 400 });
        expect(mockUsuarioRepository.atualizar).not.toHaveBeenCalled();
    });

    it('deve lançar erro ao confirmar cadastro com token expirado', async () => {
        mockUsuarioRepository.buscarPorTokenAtivacao.mockResolvedValue(
            makeUsuario({
                token_ativacao: 'token_expirado',
                token_ativacao_expira: new Date(Date.now() - 1000),
            })
        );

        await expect(service.confirmarCadastro('token_expirado', 'Senha@123')).rejects.toThrow(CustomError);
        expect(mockUsuarioRepository.atualizar).not.toHaveBeenCalled();
    });
});

describe('atualizarPerfil', () => {
    it('deve atualizar os dados do próprio perfil sem permitir alterar cargo ou status', async () => {
        mockUsuarioRepository.buscarPorId.mockResolvedValue(makeUsuario());
        mockUsuarioRepository.atualizar.mockResolvedValue(makeUsuario({ nome: 'João Editado' }));

        await service.atualizarPerfil('u1', { nome: 'João Editado', cargo: 'ADMINISTRADOR', status: 'INATIVO' }, { id: 'u1' });

        expect(mockUsuarioRepository.atualizar).toHaveBeenCalledWith(
            'u1',
            expect.not.objectContaining({ cargo: 'ADMINISTRADOR', status: 'INATIVO' })
        );
    });

    it('deve lançar erro ao atualizar perfil com e-mail já usado por outro usuário', async () => {
        mockUsuarioRepository.buscarPorId.mockResolvedValue(makeUsuario());
        mockUsuarioRepository.buscarPorEmail.mockResolvedValue(makeUsuario({ _id: 'u2', email: 'outro@email.com' }));

        await expect(
            service.atualizarPerfil('u1', { email: 'outro@email.com' }, { id: 'u1' })
        ).rejects.toThrow(CustomError);
        expect(mockUsuarioRepository.atualizar).not.toHaveBeenCalled();
    });
});
