// src/controllers/RelatorioController.js

import { relatorioService } from '../containers/services.index.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';
import { RelatorioQuerySchema } from '../utils/validators/schemas/zod/querys/RelatorioQuerySchema.js';

class RelatorioController {

  listarLotes = async (req, res, next) => {
    try {
      const { limite, page, ...filtros } = RelatorioQuerySchema.parse(req.query);

      const data = await relatorioService.listarLotes({ filtros, page, limit: limite });

      return CommonResponse.success(res, data);
    } catch (e) {
      next(e);
    }
  };

  listarMovimentacoes = async (req, res, next) => {
    try {
      const { limite, page, ...filtros } = RelatorioQuerySchema.parse(req.query);

      const data = await relatorioService.listarMovimentacoes({ filtros, page, limit: limite });

      return CommonResponse.success(res, data);
    } catch (e) {
      next(e);
    }
  };

  listarMortalidade = async (req, res, next) => {
    try {
      const { limite, page, ...filtros } = RelatorioQuerySchema.parse(req.query);

      const data = await relatorioService.listarMortalidade({ filtros, page, limit: limite });

      return CommonResponse.success(res, data);
    } catch (e) {
      next(e);
    }
  };

  listarEspecies = async (req, res, next) => {
    try {
      const { limite, page, ...filtros } = RelatorioQuerySchema.parse(req.query);

      const data = await relatorioService.listarEspecies({ filtros, page, limit: limite });

      return CommonResponse.success(res, data);
    } catch (e) {
      next(e);
    }
  };

  listarEstufas = async (req, res, next) => {
    try {
      const { limite, page, ...filtros } = RelatorioQuerySchema.parse(req.query);

      const data = await relatorioService.listarEstufas({ filtros, page, limit: limite });

      return CommonResponse.success(res, data);
    } catch (e) {
      next(e);
    }
  };

  listarUsuarios = async (req, res, next) => {
    try {
      const { limite, page, ...filtros } = RelatorioQuerySchema.parse(req.query);

      const data = await relatorioService.listarUsuarios({ filtros, page, limit: limite });

      return CommonResponse.success(res, data);
    } catch (e) {
      next(e);
    }
  };

  listarDestinatarios = async (req, res, next) => {
    try {
      const { limite, page, ...filtros } = RelatorioQuerySchema.parse(req.query);

      const data = await relatorioService.listarDestinatarios({ filtros, page, limit: limite });

      return CommonResponse.success(res, data);
    } catch (e) {
      next(e);
    }
  };

  listarAuditoria = async (req, res, next) => {
    try {
      const { limite, page, ...filtros } = RelatorioQuerySchema.parse(req.query);

      const data = await relatorioService.listarAuditoria({ filtros, page, limit: limite });

      return CommonResponse.success(res, data);
    } catch (e) {
      next(e);
    }
  };
}

export default new RelatorioController();