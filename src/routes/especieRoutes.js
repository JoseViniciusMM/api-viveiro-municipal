import express from 'express';
import { asyncWrapper } from '../utils/helpers/index.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';  
import authorize from '../middlewares/authorize.js';
import { TIPO_USUARIO } from '../constants/usuario.js';
import EspecieController from '../controllers/especieController.js';

const router = express.Router();

router
  .post('/especies',              AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(EspecieController.criar))
  .get('/especies',               AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(EspecieController.listarTodas))
  .get('/especies/:id',           AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(EspecieController.obterPorId))
  .patch('/especies/:id',         AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(EspecieController.atualizar))
  .get('/especies/:id/historico', AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(EspecieController.obterHistorico));

export default router;