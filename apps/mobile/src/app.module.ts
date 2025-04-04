import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './modules/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../shared/config/typeorm.config';
import { UserModule } from './modules/user.module';
import { CustomerModule } from './modules/customer.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig as any),
    CompanyModule,
    UserModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
