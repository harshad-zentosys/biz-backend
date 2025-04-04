import { Module } from "@nestjs/common";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { User } from "../../../shared/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "../../../shared/entities/admin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

