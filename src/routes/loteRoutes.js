import express from 'express';
import LoteController from '../controllers/loteController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';
import { asyncWrapper } from '../utils/helpers/index.js';
import authorize from '../middlewares/authorize.js';
import { TIPO_USUARIO } from '../constants/usuario.js';

const router = express.Router();

router
    .get(
        '/lotes',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(LoteController.listar)
    )
    
    .post(
        '/lotes',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(LoteController.criar)
    )

    .get(
        '/lotes/:id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(LoteController.buscarPorId)
    )

    .get(
        '/lotes/:id/historico',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(LoteController.buscarHistorico)
    )

    .patch(
        '/lotes/:id/fase',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(LoteController.atualizarFase)
    )

    .patch(
        '/lotes/:id/transferir',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(LoteController.transferir)
    )

    .post(
        '/lotes/:id/mortalidade',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(LoteController.registrarMortalidade)
    )

    .delete(
        '/lotes/:id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(LoteController.deletar)
    );

export default router;