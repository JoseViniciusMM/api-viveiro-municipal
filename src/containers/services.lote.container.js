import LoteService from '../services/loteService.js';
import { 
    loteRepository, 
    estufaRepository,
    especieRepository, 
} from './repositories.all.container.js';
import { movimentacaoService } from './services.movimentacao.container.js';
import { auditoriaService } from './services.auditoria.container.js';

export const loteService = new LoteService({
    loteRepository,
    estufaRepository,
    movimentacaoService,
    especieRepository,
    auditoriaService,
});