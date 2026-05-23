import UsuarioRepository from '../repositories/usuarioRepository.js';
import MovimentacaoRepository from '../repositories/movimentacaoRepository.js';
import EspecieRepository from '../repositories/especieRepository.js';
import LoteRepository from '../repositories/loteRepository.js';
import EstufaRepository from '../repositories/estufaRepository.js';
import DestinatarioRepository from '../repositories/destinatarioRepository.js';
import LogAuditoriaRepository from '../repositories/LogAuditoriaRepository.js';
import DashboardRepository from '../repositories/dashboardRepository.js';

export const usuarioRepository = new UsuarioRepository();
export const movimentacaoRepository = new MovimentacaoRepository();
export const especieRepository = new EspecieRepository();
export const loteRepository = new LoteRepository();
export const estufaRepository = new EstufaRepository();
export const destinatarioRepository = new DestinatarioRepository();
export const logAuditoriaRepository = new LogAuditoriaRepository();
export const dashboardRepository = new DashboardRepository();
