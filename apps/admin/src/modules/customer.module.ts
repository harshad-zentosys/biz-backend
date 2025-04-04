import { Module } from "@nestjs/common";
import { CustomerController } from "../controllers/customer.controller";
import { CustomerService } from "../services/customer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "../../../shared/entities/customer.entity";
import { User } from "../../../shared/entities/user.entity";
import { UserDevice } from "../../../shared/entities/user-device.entity";
import { Company } from "../../../shared/entities/company.entity";
import { Admin } from "../../../shared/entities/admin.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Customer, Company, UserDevice, User, Admin])],
    controllers: [CustomerController],
    providers: [CustomerService],
})
export class CustomerModule {}
