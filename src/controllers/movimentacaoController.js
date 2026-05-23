import { movimentacaoService } from '../containers/services.index.js';
import { MovimentacaoSchema } from '../utils/validators/schemas/zod/MovimentacaoSchema.js';
import { MovimentacaoIdSchema, MovimentacaoQuerySchema } from '../utils/validators/schemas/zod/querys/MovimentacaoQuerySchema.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';

class MovimentacaoController {

    listar = async (req, res, next) => {
        try {
            
            const { limite, page, ...filtros } = MovimentacaoQuerySchema.parse(req.query ?? {});
            
            const data = await movimentacaoService.listar({ 
                filtros, 
                page, 
                limit: limite 
            });
            
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };
   
    buscarPorId = async (req, res, next) => {
        try {
            MovimentacaoIdSchema.parse(req.params.id);
            const data = await movimentacaoService.buscarPorId(req.params.id);
            
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    criar = async (req, res, next) => {
        try {
           
            const dadosValidados = MovimentacaoSchema.parse(req.body);
          
            const data = await movimentacaoService.criar(dadosValidados, req.user);
            
            return CommonResponse.created(res, data);
        } catch (e) {
            next(e);
        }
    };

    estornar = async (req, res, next) => {
        try {
            MovimentacaoIdSchema.parse(req.params.id);
            

            const data = await movimentacaoService.estornar(req.params.id, req.user);
            
            return CommonResponse.created(res, data);
        } catch (e) {
            next(e);
        }
    };

    buscarPorEspecie = async (req, res, next) => {
        try {
            const { especie_id } = req.params;
            const { limite, page, ...filtros } = MovimentacaoQuerySchema.parse(req.query ?? {});
            
            const data = await movimentacaoService.listar({
                filtros: { ...filtros, especieId: especie_id },
                page,
                limit: limite
            });
            
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    buscarPorLote = async (req, res, next) => {
        try {
            const { lote_id } = req.params;
            const { limite, page, ...filtros } = MovimentacaoQuerySchema.parse(req.query ?? {});
            
            const data = await movimentacaoService.listar({
                filtros: { ...filtros, loteId: lote_id },
                page,
                limit: limite
            });
            
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };
}

export default new MovimentacaoController();