import express from 'express';
import AuthController from '../controllers/authController.js';
import { asyncWrapper } from '../utils/helpers/index.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router
    .post('/login', asyncWrapper(AuthController.login))
    .post('/logout', AuthMiddleware, asyncWrapper(AuthController.logout))
    .post('/refresh-token', asyncWrapper(AuthController.refreshToken))
    .post('/esqueceu-senha', asyncWrapper(AuthController.esqueceuSenha));

export default router;