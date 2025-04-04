import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { DashboardService } from "../services/dashboard.service";
import { Response } from "express";
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get("get-dashboard-data")
    async getDashboardData(@Res() res: Response) {
        try {
            const data = await this.dashboardService.getDashboardData();
            return res.status(HttpStatus.OK).json({
                success: true,
                data
            });
        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.message || 'Internal server error';
            return res.status(status).json({status, message});
        }
    }
}
