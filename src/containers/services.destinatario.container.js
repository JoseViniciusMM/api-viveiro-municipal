import DestinatarioService from '../services/destinatarioService.js';
import { destinatarioRepository } from './repositories.all.container.js';
import { auditoriaService } from './services.auditoria.container.js';

export const destinatarioService = new DestinatarioService({
    destinatarioRepository,
    auditoriaService,
});