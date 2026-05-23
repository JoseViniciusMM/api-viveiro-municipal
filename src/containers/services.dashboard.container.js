import { dashboardRepository } from './repositories.all.container.js';
import DashboardService from '../services/dashboardService.js';

export const dashboardService = new DashboardService({ dashboardRepository });