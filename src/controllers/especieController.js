import { especieService } from '../containers/services.index.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';
import { EspecieSchema, EspecieUpdateSchema } from '../utils/validators/schemas/zod/EspecieSchema.js';
import { EspecieIdSchema, EspecieQuerySchema } from '../utils/validators/schemas/zod/querys/EspecieQuerySchema.js';

class EspecieController {
    criar = async (req, res, next) => {
        try {
            const parsedData = EspecieSchema.parse(req.body);
            const data = await especieService.criar(parsedData, req.user);
            return CommonResponse.created(res, data);
        } catch (e) {
            next(e);
        }
    };

    listarTodas = async (req, res, next) => {
        try {
            const { limite, page, ...filtros } = EspecieQuerySchema.parse(req.query ?? {});
            const data = await especieService.listarTodas({ filtros, page, limit: limite });
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    obterPorId = async (req, res, next) => {
        try {
            EspecieIdSchema.parse(req.params.id);
            const data = await especieService.buscarPorId(req.params.id);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    atualizar = async (req, res, next) => {
        try {
            EspecieIdSchema.parse(req.params.id);
            const parsedData = EspecieUpdateSchema.parse(req.body);
            const data = await especieService.atualizar(req.params.id, parsedData, req.user);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    obterHistorico = async (req, res, next) => {
        try {
            EspecieIdSchema.parse(req.params.id);
            const data = await especieService.obterHistorico(req.params.id);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };
}

export default new EspecieController();