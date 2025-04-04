import { Module } from '@nestjs/common';
import { CompanyController } from '../controllers/company.controller';
import { CompanyService } from '../services/company.service';
import { Company } from '../../../shared/entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
