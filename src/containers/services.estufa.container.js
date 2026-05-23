import EstufaService from '../services/estufaService.js';
import { estufaRepository, loteRepository } from './repositories.all.container.js';
import { auditoriaService } from './services.auditoria.container.js';

export const estufaService = new EstufaService({
    estufaRepository,
    loteRepository,
    auditoriaService,
});