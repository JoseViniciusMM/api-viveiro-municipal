import MovimentacaoService from '../services/movimentacaoService.js';
import { 
    movimentacaoRepository, 
    especieRepository, 
    loteRepository, 
    destinatarioRepository 
} from './repositories.all.container.js';
import { auditoriaService } from './services.auditoria.container.js';

export const movimentacaoService = new MovimentacaoService({
    movimentacaoRepository,
    especieRepository,
    loteRepository,
    destinatarioRepository,
    auditoriaService,
});