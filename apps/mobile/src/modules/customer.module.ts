import { Module } from '@nestjs/common';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../../../shared/entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity';
import { CustomerAddress } from '../../../shared/entities/customer-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, User, CustomerAddress])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}

