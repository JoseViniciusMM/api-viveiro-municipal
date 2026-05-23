import express from 'express';
import { asyncWrapper } from '../utils/helpers/index.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';  
import authorize from '../middlewares/authorize.js';
import { TIPO_USUARIO } from '../constants/usuario.js';
import DestinatarioController from '../controllers/destinatarioController.js';

const router = express.Router();

router
  .post('/destinatarios',       AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(DestinatarioController.criar))
  .get('/destinatarios',        AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(DestinatarioController.listar))
  .get('/destinatarios/:id',    AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(DestinatarioController.buscarPorId))
  .patch('/destinatarios/:id',  AuthMiddleware, authorize(TIPO_USUARIO.Administrador, TIPO_USUARIO.Operador), asyncWrapper(DestinatarioController.atualizar))
  .delete('/destinatarios/:id', AuthMiddleware, authorize(TIPO_USUARIO.Administrador),                               asyncWrapper(DestinatarioController.inativar));

export default router;