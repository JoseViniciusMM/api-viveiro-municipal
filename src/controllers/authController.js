import { authService } from '../containers/services.index.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';

class AuthController {

    login = async (req, res, next) => {
        try {
            const data = await authService.login(req.body);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };

    logout = async (req, res, next) => {
        try {
            const { id } = req.user;
            await authService.logout(id);
            return CommonResponse.success(res, null, 200, 'Logout realizado com sucesso.');
        } catch (e) {
            next(e);
        }
    };

    refreshToken = async (req, res, next) => {
        try {
            const result = await authService.refreshToken(req.body.refreshToken);
            return CommonResponse.success(res, result);
        } catch (e) {
            next(e);
        }
    };

    esqueceuSenha = async (req, res, next) => {
        try {
            await authService.esqueceuSenha(req.body.email);
            return CommonResponse.success(res, null, 200, 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.');
        } catch (e) {
            next(e);
        }
    };
}

export default new AuthController();