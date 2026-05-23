import { CustomError, messages } from '../utils/helpers/index.js';
import { TIPO_USUARIO } from '../constants/usuario.js';

class LogAuditoriaService {
  constructor({ logAuditoriaRepository }) {
    this.repository = logAuditoriaRepository;
  }

  async registrar(dados) {
    try {
      return await this.repository.registrar({
        usuario_id: dados.usuario_id || dados.usuarioId || null,
        acao: dados.acao,
        detalhes_mudanca: dados.detalhes_mudanca || dados.detalhes || {},
      });
    } catch (error) {
      console.error('[PAMINE] Erro ao registrar log de auditoria:', error.message);
    }
  }

  async listar({ filtros = {}, page = 1, limit = 20 }, actor = null, isInternal = false) {
  
    if (!isInternal) {
      const isAdmin = actor && (actor.cargo === TIPO_USUARIO.Administrador || (actor.papeis && actor.papeis.includes(TIPO_USUARIO.Administrador)));
      
      if (!isAdmin) {
        throw new CustomError({
          statusCode: 403,
          customMessage: 'Acesso negado. Apenas administradores podem visualizar os logs de auditoria globais.'
        });
      }
    }

    return this.repository.listar({
      filtros,
      page: Math.max(1, Number(page) || 1),
      limit: Math.max(1, Number(limit) || 20),
    });
  }
}

export default LogAuditoriaService;