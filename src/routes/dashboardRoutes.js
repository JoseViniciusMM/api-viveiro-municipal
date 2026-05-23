import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';
import authorize from '../middlewares/authorize.js';
import { asyncWrapper } from '../utils/helpers/index.js';
import { TIPO_USUARIO } from '../constants/usuario.js';

const router = express.Router();

router
    .get('/dashboard/geral', AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(DashboardController.geral));

export default router;