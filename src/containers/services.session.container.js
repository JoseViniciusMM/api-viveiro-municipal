import SessionService from '../services/sessionService.js';
import { usuarioRepository } from './repositories.all.container.js';

export const sessionService = new SessionService({ usuarioRepository });