import { CustomError } from '../utils/helpers/index.js';

class DashboardService {
    constructor({ dashboardRepository }) {
        this.repository = dashboardRepository;
    }

    async geral(usuario) {
        if (!usuario) {
            throw new CustomError({ statusCode: 403, customMessage: 'Acesso negado. Usuário não autenticado.' });
        }
        return this.repository.geral();
    }
}

export default DashboardService;
