// src/routes/relatorioRoutes.js

import express from 'express';
import { asyncWrapper } from '../utils/helpers/index.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';
import RelatorioController from '../controllers/RelatorioController.js';
import authorize from '../middlewares/authorize.js';
import { TIPO_USUARIO } from '../constants/usuario.js';


const router = express.Router();

router
  // ── Histórico de Lotes ──
  .get(
    '/lotes',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
    asyncWrapper(RelatorioController.listarLotes)
  )
  // ── Movimentações ──
  .get(
    '/movimentacoes',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
    asyncWrapper(RelatorioController.listarMovimentacoes)
  )
  // ── Mortalidade ──
  .get(
    '/mortalidade',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
    asyncWrapper(RelatorioController.listarMortalidade)
  );

export default router;