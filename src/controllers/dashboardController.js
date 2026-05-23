import { dashboardService } from '../containers/services.index.js';
import CommonResponse from '../utils/helpers/CommonResponse.js';

class DashboardController {
    geral = async (req, res, next) => {
        try {
            const data = await dashboardService.geral(req.user);
            return CommonResponse.success(res, data);
        } catch (e) {
            next(e);
        }
    };
}

export default new DashboardController();
