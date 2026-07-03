import { usuarioService } from '../containers/services.index.js';
import {
    UsuarioSchema,
    UsuarioUpdateSchema,
    ConfirmarCadastroSchema,
    AtualizarPerfilSchema,
} from '../utils/validators/schemas/zod/UsuarioSchema.js';
import { UsuarioIdSchema, UsuarioQuerySchema } from '../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';

const SENHA_PADRAO_ATIVACAO = 'Viveiro@123';

class UsuarioController {

    listar = async (req, res, next) => {
        try {
            const { limite, page, ...filtros } = UsuarioQuerySchema.parse(req.query);
            const data = await usuarioService.listar({ filtros, page, limit: limite });
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    buscarPorId = async (req, res, next) => {
        try {
            UsuarioIdSchema.parse(req.params.id);
            const data = await usuarioService.buscarPorId(req.params.id);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    criar = async (req, res, next) => {
        try {
            const parsedData = UsuarioSchema.parse(req.body);
            const data = await usuarioService.criar(parsedData, req.user);
            const usuarioLimpo = data.toObject();
            delete usuarioLimpo.senha;
            return CommonResponse.created(res, usuarioLimpo);
        } catch (e) {
            next(e);
        }
    };

    atualizar = async (req, res, next) => {
        try {
            UsuarioIdSchema.parse(req.params.id);
            const parsedData = UsuarioUpdateSchema.parse(req.body);
            const data = await usuarioService.atualizar(req.params.id, parsedData, req.user);
            const usuarioLimpo = data.toObject();
            delete usuarioLimpo.senha;
            return CommonResponse.success(res, usuarioLimpo);
        } catch (e) {
            next(e);
        }
    };

    inativar = async (req, res, next) => {
        try {
            UsuarioIdSchema.parse(req.params.id);
            await usuarioService.inativar(req.params.id, req.user);
            return CommonResponse.success(res, null, 204);
        } catch (e) {
            next(e);
        }
    };

    confirmarCadastro = async (req, res, next) => {
        try {
            const token = req.query.token || req.body?.token;
            const senha = req.body?.senha || SENHA_PADRAO_ATIVACAO;

            if (!token) {
                return CommonResponse.error(res, 400, 'validationError', null, [{ message: 'Token é obrigatório.' }]);
            }

            const data = await usuarioService.confirmarCadastro(token, senha);
            return CommonResponse.success(res, data, 200, `Conta ativada com sucesso. Senha definida: ${senha}`);
        } catch (e) {
            next(e);
        }
    };

    atualizarPerfil = async (req, res, next) => {
        try {
            const parsedData = AtualizarPerfilSchema.parse(req.body);
            const data = await usuarioService.atualizarPerfil(req.user.id, parsedData, req.user);
            const usuarioLimpo = data.toObject();
            delete usuarioLimpo.senha;
            return CommonResponse.success(res, usuarioLimpo);
        } catch (e) {
            next(e);
        }
    };
}

export default new UsuarioController();