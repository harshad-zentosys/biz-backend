import { Module } from "@nestjs/common";
import { DashboardController } from "../controllers/dashboard.controller";
import { DashboardService } from "../services/dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "../../../shared/entities/admin.entity";
import { Customer } from "../../../shared/entities/customer.entity";
import { Payments } from "../../../shared/entities/payments.entity";
import { UserDevice } from "../../../shared/entities/user-device.entity";
import { User } from "../../../shared/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Admin, Customer, UserDevice, Payments, User])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
