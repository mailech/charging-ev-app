import type { RequestHandler } from 'express';
import * as dashboardService from './dashboard.service.js';

export const overviewHandler: RequestHandler = async (_req, res, next) => {
    try {
        res.json(await dashboardService.getOverview());
    } catch (err) {
        next(err);
    }
};
