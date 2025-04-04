import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from '../../shared/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncModule } from './modules/sync.module';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './modules/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig as any),
    SyncModule,
    CompanyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
