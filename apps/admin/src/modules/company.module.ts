import { Module } from "@nestjs/common";
import { CompanyController } from "../controllers/company.controller";
import { CompanyService } from "../services/company.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "../../../shared/entities/company.entity";
import { Admin } from "../../../shared/entities/admin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Company, Admin])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
