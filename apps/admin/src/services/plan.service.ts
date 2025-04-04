import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Plans } from "../../../shared/entities/plans.entity";
import { DURATION_TYPES } from "../../../shared/constants/constants";
@Injectable()
export class PlanService {

    constructor(
        @InjectRepository(Plans)
        private planRepository: Repository<Plans>,
    ) {}

    async getPlans(body: { query: string, page: number, limit: number }) {
        try {
            const { query, page = 1, limit = 10 } = body;
            let filter: any = {};
            if (query) {
                filter.name = Like(`%${query}%`);
            }
            const [plans, total] = await this.planRepository.findAndCount({
                where: filter,
                skip: (page - 1) * limit,
                take: limit,
            });
            return { plans, total, totalPages: Math.ceil(total / limit) };
        } catch (error) {
            throw new Error(error);
        }
    }

    private validateNumber = (value: number, fieldName: string) => {
        if (!value) {
            return;
        }
        if (isNaN(value) || value < 0) {
            throw new Error(`${fieldName} must be a number and greater than 0`);
        }
    };

    private changeName = (name: string) => {
        return name.toUpperCase().replace(/\s+/g, '_');
    }

    async createPlan(body: Plans) {
        try {
            const { name, cost, perDeviceCost, duration, durationType } = body;
            if (!name) {
                throw new Error("Name is required");
            }

            this.validateNumber(cost, "Cost");
            this.validateNumber(perDeviceCost, "Per device cost");
            this.validateNumber(duration, "Duration");

            if (durationType && !Object.values(DURATION_TYPES).includes(durationType)) {
                throw new Error("Invalid duration type");
            }

            body.name = this.changeName(name);
            const plan = this.planRepository.create(body);
            return await this.planRepository.save(plan);
        } catch (error) {
            throw new Error(error);
        }
    }

    async updatePlan(id: string, body: Plans) {
        try {
            const plan = await this.planRepository.findOneBy({ id });
            if (!plan) {
                throw new Error("Plan not found");
            }

            const { name, cost, perDeviceCost, duration, durationType } = body;
            if (name) {
                plan.name = this.changeName(name);
            }
            if (cost) {
                this.validateNumber(cost, "Cost");
                plan.cost = cost;
            }
            if (perDeviceCost) {
                this.validateNumber(perDeviceCost, "Per device cost");
                plan.perDeviceCost = perDeviceCost;
            }
            if (duration) {
                this.validateNumber(duration, "Duration");
                plan.duration = duration;
            }
            if (durationType) {
                if (!Object.values(DURATION_TYPES).includes(durationType)) {
                    throw new Error("Invalid duration type");
                }
                plan.durationType = durationType;
            }

            const updatedPlan = await this.planRepository.save(plan);
            return updatedPlan;
        } catch (error) {
            throw new Error(error);
        }
    }
}

