import EspecieService from '../services/especieService.js';
import { especieRepository, movimentacaoRepository } from './repositories.all.container.js';
import { auditoriaService } from './services.auditoria.container.js';

export const especieService = new EspecieService({
    especieRepository,
    movimentacaoRepository,
    auditoriaService,
});
