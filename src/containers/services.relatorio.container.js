import RelatorioService from '../services/RelatorioService.js';
import { loteRepository, movimentacaoRepository } from './repositories.all.container.js';

export const relatorioService = new RelatorioService({
    loteRepository,
    movimentacaoRepository,
});
