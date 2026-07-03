import AuthService from '../services/authService.js';
import { usuarioRepository } from './repositories.all.container.js';
import { auditoriaService } from './services.auditoria.container.js';
import AuthHelper from '../utils/AuthHelper.js';
import { tokenService } from './services.token.container.js';
import { sessionService } from './services.session.container.js';
import { mailService } from './infra.mail.container.js';

export const authService = new AuthService({
    usuarioRepository,
    passwordHasher: AuthHelper,
    auditoriaService,
    tokenService,
    sessionService,
    mailService
});