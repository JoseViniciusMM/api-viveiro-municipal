import LogAuditoriaService from '../services/logAuditoriaService.js';
import { logAuditoriaRepository } from './repositories.all.container.js';

export const auditoriaService = new LogAuditoriaService({
    logAuditoriaRepository,
});
