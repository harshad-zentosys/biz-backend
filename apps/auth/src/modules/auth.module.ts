import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { Customer } from '../../../shared/entities/customer.entity';
import { User } from '../../../shared/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevice } from '../../../shared/entities/user-device.entity';
import { RedisService } from '../../../shared/services/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Customer, UserDevice])],
  controllers: [AuthController],
  providers: [AuthService, RedisService],
})
export class AuthModule {}

