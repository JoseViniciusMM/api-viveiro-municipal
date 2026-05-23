import express from 'express';
import MovimentacaoController from '../controllers/movimentacaoController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';
import { asyncWrapper } from '../utils/helpers/index.js';
import authorize from '../middlewares/authorize.js';
import { TIPO_USUARIO } from '../constants/usuario.js';

const router = express.Router();

router
    .get(
        '/movimentacoes',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(MovimentacaoController.listar),
    )
    .post(
        '/movimentacoes',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(MovimentacaoController.criar),
    )
    .post(
        '/movimentacoes/:id/estorno',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(MovimentacaoController.estornar),
    )
    .get(
        '/movimentacoes/:id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(MovimentacaoController.buscarPorId),
    )
    .get(
        '/movimentacoes/especie/:especie_id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(MovimentacaoController.buscarPorEspecie),
    )
    .get(
        '/movimentacoes/lote/:lote_id',
        AuthMiddleware,
        authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
        asyncWrapper(MovimentacaoController.buscarPorLote),
    );

export default router;