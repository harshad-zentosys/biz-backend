import { Controller, Post, Param, Body, Put, Get, Query, HttpStatus, HttpCode, UseGuards, Res } from '@nestjs/common';
import { PlanService } from '../services/plan.service';
import { Plans } from '../../../shared/entities/plans.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Response } from 'express';

@Controller('plans')
export class PlanController {
	constructor(private readonly planService: PlanService) { }

	@Post("create")
	@UseGuards(AuthGuard)
	async createPlan(@Body() body: Plans, @Res() res: Response) {
		try {
			const plan = await this.planService.createPlan(body);
			return res.status(HttpStatus.OK).json({
				message: "Plan created successfully",
				status: HttpStatus.OK,
				plan
			})
		} catch (error) {
			const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
			const message = error.message || "Failed to create plan";
			return res.status(status).json({status, message});
		}
	}

	@Post("update/:id")
	@UseGuards(AuthGuard)
	async updatePlan(@Param("id") id: string, @Body() body: Plans, @Res() res: Response) {
		try {
			const plan = await this.planService.updatePlan(id, body);
			return res.status(HttpStatus.OK).json({
				message: "Plan updated successfully",
				status: HttpStatus.OK,
				plan
			})
		} catch (error) {
			const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
			const message = error.message || "Failed to update plan";
			return res.status(status).json({status, message});
		}
	}

	@Post("search")
	@UseGuards(AuthGuard)
	async getPlans(@Body() body: { query: string, page: number, limit: number }, @Res() res: Response) {
		try {
			const plans = await this.planService.getPlans(body);		
			return res.status(HttpStatus.OK).json({
				message: "Plans fetched successfully",
				status: HttpStatus.OK,
				plans
			})
		} catch (error) {
			const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
			const message = error.message || "Failed to fetch plans";
			return res.status(status).json({status, message});
		}
	}
}

