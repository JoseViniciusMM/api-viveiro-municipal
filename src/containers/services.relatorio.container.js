import RelatorioService from '../services/RelatorioService.js';
import { loteRepository, movimentacaoRepository, especieRepository, estufaRepository, usuarioRepository, destinatarioRepository, logAuditoriaRepository } from './repositories.all.container.js';

export const relatorioService = new RelatorioService({
    loteRepository,
    movimentacaoRepository,
    especieRepository,
    estufaRepository,
    usuarioRepository,
    destinatarioRepository,
    logAuditoriaRepository,
});
