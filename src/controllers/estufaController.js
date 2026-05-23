import { estufaService } from '../containers/services.index.js';
import { EstufaSchema, EstufaUpdateSchema } from '../utils/validators/schemas/zod/EstufaSchema.js';
import { EstufaIdSchema, EstufaQuerySchema } from '../utils/validators/schemas/zod/querys/Estufaqueryschema.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';

class EstufaController {
    listar = async (req, res, next) => {
        try {
            const { limite, page, ...filtros } = EstufaQuerySchema.parse(req.query ?? {});
            const data = await estufaService.listar({ filtros, page, limit: limite });
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    buscarPorId = async (req, res, next) => {
        try {
            EstufaIdSchema.parse(req.params.id);
            const data = await estufaService.buscarPorId(req.params.id);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    criar = async (req, res, next) => {
        try {
            const parsedData = EstufaSchema.parse(req.body);
            const data = await estufaService.criar(parsedData, req.user);
            return CommonResponse.created(res, data);
        } catch (e) {
            next(e);
        }
    };

    atualizar = async (req, res, next) => {
        try {
            EstufaIdSchema.parse(req.params.id);
            const parsedData = EstufaUpdateSchema.parse(req.body);
            const data = await estufaService.atualizar(req.params.id, parsedData, req.user);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    inativar = async (req, res, next) => {
        try {
            EstufaIdSchema.parse(req.params.id);
            await estufaService.inativar(req.params.id, req.user);
            return res.status(204).end();
        } catch (e) {
            next(e);
        }
    };
}


export default new EstufaController();