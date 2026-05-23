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

    // listar sevidores com filtros e paginação
    .get(
        '/usuarios',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador),
        asyncWrapper(UsuarioController.listar),
    )

    // Atualizar dados/cargo/status de um servidor
    .patch(
        '/usuarios/:id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador),
        asyncWrapper(UsuarioController.atualizar),
    )

    // soft delete
    .delete(
        '/usuarios/:id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador),
        asyncWrapper(UsuarioController.inativar),
    )

    // buscar servidor por id
    .get(
        '/usuarios/:id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador),
        asyncWrapper(UsuarioController.buscarPorId),
    )

    // Confirmar cadastro e redefinir login
    .post(
        '/usuarios/confirmar-cadastro',
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(UsuarioController.confirmarCadastro),
    )

    // Atualizar o proprio perfil
    .patch(
        '/usuarios/perfil',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(UsuarioController.atualizarPerfil),
    );

export default router;
