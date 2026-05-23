// src/routes/auditoriaRoutes.js

import express from 'express';
import { asyncWrapper } from '../utils/helpers/index.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';
import authorize from '../middlewares/authorize.js';
import AuditoriaController from '../controllers/auditoriaController.js';
import { TIPO_USUARIO } from '../constants/usuario.js';

const router = express.Router();

router
  .get(
    '/auditoria/logs',
    AuthMiddleware,
    authorize(TIPO_USUARIO.Administrador),
    asyncWrapper(AuditoriaController.listar)
  );

export default router;