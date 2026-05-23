import express from 'express';
import { asyncWrapper } from '../utils/helpers/index.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';  
import authorize from '../middlewares/authorize.js';
import { TIPO_USUARIO } from '../constants/usuario.js';
import EstufaController from '../controllers/estufaController.js';

const router = express.Router();

router
  .post('/estufas',       AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(EstufaController.criar))
  .get('/estufas',        AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(EstufaController.listar))
  .get('/estufas/:id',    AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(EstufaController.buscarPorId))
  .patch('/estufas/:id',  AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(EstufaController.atualizar))
  .delete('/estufas/:id', AuthMiddleware, authorize(TIPO_USUARIO.Administrador),                               asyncWrapper(EstufaController.inativar));

export default router;