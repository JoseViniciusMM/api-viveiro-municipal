import { auditoriaService } from '../containers/services.index.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';
import { AuditoriaQuerySchema } from '../utils/validators/schemas/zod/AuditoriaSchema.js';

class AuditoriaController {
    listar = async (req, res, next) => {
        try {
            const { page, limit, ...filtros } = AuditoriaQuerySchema.parse(req.query);

            const data = await auditoriaService.listar({
                filtros,
                page,
                limit,
            }, req.user);

            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };
}

export default new AuditoriaController();
