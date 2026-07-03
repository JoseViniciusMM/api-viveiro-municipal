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
    '/relatorios/lotes',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
    asyncWrapper(RelatorioController.listarLotes)
  )
  // ── Movimentações ──
  .get(
    '/relatorios/movimentacoes',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
    asyncWrapper(RelatorioController.listarMovimentacoes)
  )
  // ── Mortalidade ──
  .get(
    '/relatorios/mortalidade',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
    asyncWrapper(RelatorioController.listarMortalidade)
  )
  // ── Espécies ──
  .get(
    '/relatorios/especies',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
    asyncWrapper(RelatorioController.listarEspecies)
  )
  // ── Estufas ──
  .get(
    '/relatorios/estufas',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
    asyncWrapper(RelatorioController.listarEstufas)
  )
  // ── Usuários ──
  .get(
    '/relatorios/usuarios',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador),
    asyncWrapper(RelatorioController.listarUsuarios)
  )
  // ── Destinatários ──
  .get(
    '/relatorios/destinatarios',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador),
    asyncWrapper(RelatorioController.listarDestinatarios)
  )
  // ── Auditoria ──
  .get(
    '/relatorios/auditoria',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador),
    asyncWrapper(RelatorioController.listarAuditoria)
  );

export default router;