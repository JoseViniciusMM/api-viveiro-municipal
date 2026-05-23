import UsuarioService from '../services/usuarioService.js';
import { usuarioRepository } from './repositories.all.container.js';
import { auditoriaService } from './services.auditoria.container.js';
import passwordHasher from '../utils/passwordHasher.js';
import { tokenService } from './services.token.container.js';

export const usuarioService = new UsuarioService({
    usuarioRepository,
    passwordHasher,
    auditoriaService,
    tokenService,
    mailService: null,
});