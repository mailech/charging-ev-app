import { Router } from 'express';
import { overviewHandler } from './dashboard.controller.js';

export const dashboardAdminRouter: Router = Router();
dashboardAdminRouter.get('/overview', overviewHandler);
