import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';
import authorize from '../middlewares/authorize.js';
import { asyncWrapper } from '../utils/helpers/index.js';
import { TIPO_USUARIO } from '../constants/usuario.js';

const router = express.Router();

router
    // Cadastrar novo servidor
    .post(
        '/usuarios',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador),
        asyncWrapper(UsuarioController.criar),
    )

    // Listar servidores com filtros e paginação
    .get(
        '/usuarios',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador),
        asyncWrapper(UsuarioController.listar),
    )

    // Confirmar cadastro via link do e-mail
    .get(
        '/usuarios/confirmar-cadastro',
        asyncWrapper(UsuarioController.confirmarCadastro),
    )
    
    .post(
        '/usuarios/confirmar-cadastro',
        asyncWrapper(UsuarioController.confirmarCadastro),
    )

    // Atualizar o próprio perfil
    .patch(
        '/usuarios/perfil',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(UsuarioController.atualizarPerfil),
    )

    // Atualizar dados/cargo/status de um servidor
    .patch(
        '/usuarios/:id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador),
        asyncWrapper(UsuarioController.atualizar),
    )

    // Soft delete
    .delete(
        '/usuarios/:id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador),
        asyncWrapper(UsuarioController.inativar),
    )

    // Buscar servidor por id
    .get(
        '/usuarios/:id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador),
        asyncWrapper(UsuarioController.buscarPorId),
    );

export default router;
