import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from "../services/user.service";
import { User } from '../../../shared/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../../shared/entities/customer.entity';
import { Company } from '../../../shared/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Customer, Company])],  
  controllers: [UserController], 
  providers: [UserService], 
})
export class UserModule {}
