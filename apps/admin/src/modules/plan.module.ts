import { Module } from "@nestjs/common";
import { PlanController } from "../controllers/plan.contoller";
import { PlanService } from "../services/plan.service";
import { Plans } from "../../../shared/entities/plans.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "../../../shared/entities/admin.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Plans, Admin])],
    controllers: [PlanController],
    providers: [PlanService],
})
export class PlanModule {}
