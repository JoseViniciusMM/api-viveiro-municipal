import { destinatarioService } from '../containers/services.index.js';
import { DestinatarioSchema, DestinatarioUpdateSchema } from '../utils/validators/schemas/zod/Destinatarioschema.js';
import { DestinatarioIdSchema, DestinatarioQuerySchema } from '../utils/validators/schemas/zod/querys/Destinatarioqueryschema.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';

class DestinatarioController {
    listar = async (req, res, next) => {
        try {
            const { limite, page, ...filtros } = DestinatarioQuerySchema.parse(req.query ?? {});
            const data = await destinatarioService.listar({ filtros, page, limit: limite });
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    buscarPorId = async (req, res, next) => {
        try {
            DestinatarioIdSchema.parse(req.params.id);
            const data = await destinatarioService.buscarPorId(req.params.id);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    criar = async (req, res, next) => {
        try {
            const parsedData = DestinatarioSchema.parse(req.body);
            const data = await destinatarioService.criar(parsedData, req.user);
            return CommonResponse.created(res, data);
        } catch (e) {
            next(e);
        }
    };

    atualizar = async (req, res, next) => {
        try {
            DestinatarioIdSchema.parse(req.params.id);
            const parsedData = DestinatarioUpdateSchema.parse(req.body);
            const data = await destinatarioService.atualizar(req.params.id, parsedData, req.user);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    inativar = async (req, res, next) => {
        try {
            DestinatarioIdSchema.parse(req.params.id);
            await destinatarioService.inativar(req.params.id, req.user);
            return res.status(204).end();
        } catch (e) {
            next(e);
        }
    };
}

export default new DestinatarioController();