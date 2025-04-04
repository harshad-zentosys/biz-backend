import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin.module';
import { typeOrmConfig } from '../../shared/config/typeorm.config'; 
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './modules/company.module';
import { UserModule } from './modules/user.module';
import { CustomerModule } from './modules/customer.module';
import { PlanModule } from './modules/plan.module';
import { DashboardModule } from './modules/dashboard.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig as any),
    AdminModule,
    CompanyModule,
    UserModule,
    CustomerModule,
    PlanModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
