import { loteService } from '../containers/services.index.js';
import { 
    LoteCriacaoSchema, 
    LoteAtualizacaoFaseSchema, 
    LoteMortalidadeSchema, 
    LoteTransferenciaSchema, 
    LoteDelecaoSchema 
} from '../utils/validators/schemas/zod/LoteSchema.js';
import { 
    LoteIdSchema, 
    LoteQuerySchema 
} from '../utils/validators/schemas/zod/querys/LoteQuerySchema.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';

class LoteController {
    listar = async (req, res, next) => {
        try {
            const { limite, page, ...filtros } = LoteQuerySchema.parse(req.query ?? {});
            
            const data = await loteService.listar({ 
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
            LoteIdSchema.parse(req.params.id);
            const data = await loteService.buscarPorId(req.params.id);
            
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    buscarHistorico = async (req, res, next) => {
        try {
            LoteIdSchema.parse(req.params.id);
            const data = await loteService.buscarHistorico(req.params.id);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    criar = async (req, res, next) => {
        try {
            const dadosValidados = LoteCriacaoSchema.parse(req.body);
            
            const data = await loteService.criar(dadosValidados, req.user);
            
            return CommonResponse.created(res, data);
        } catch (e) {
            next(e);
        }
    };

    atualizarFase = async (req, res, next) => {
        try {
            LoteIdSchema.parse(req.params.id);
            const { fase } = LoteAtualizacaoFaseSchema.parse(req.body);
            
            const data = await loteService.atualizarFase(req.params.id, fase, req.user);
            
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    registrarMortalidade = async (req, res, next) => {
        try {
            LoteIdSchema.parse(req.params.id);
            const dadosValidados = LoteMortalidadeSchema.parse(req.body);
            
            const data = await loteService.registrarMortalidade(req.params.id, dadosValidados, req.user);
            
            return CommonResponse.created(res, data); 
        } catch (e) {
            next(e);
        }
    };

    transferir = async (req, res, next) => {
        try {
            LoteIdSchema.parse(req.params.id);
            const { nova_estufa_id } = LoteTransferenciaSchema.parse(req.body);
            
            const data = await loteService.transferir(req.params.id, nova_estufa_id, req.user);
            
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    deletar = async (req, res, next) => {
        try {
            LoteIdSchema.parse(req.params.id);
            const { justificativa } = LoteDelecaoSchema.parse(req.body);
            
            await loteService.deletar(req.params.id, justificativa, req.user);
            
            return CommonResponse.success(res, null, 204);
        } catch (e) {
            next(e);
        }
    };
}

export default new LoteController();