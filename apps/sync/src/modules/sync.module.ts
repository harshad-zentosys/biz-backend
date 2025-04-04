import { Module } from '@nestjs/common';
import { SyncController } from '../controllers/sync.controller';
import { SyncService } from '../services/sync.service';
import { AccountGroup } from '../../../shared/entities/account-groups.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity';
import { Company } from '../../../shared/entities/company.entity';
import { AccountsLedger } from '../../../shared/entities/accounts-ledgers.entity';
import { Voucher } from '../../../shared/entities/vouchers.entity';
import { Inventory } from '../../../shared/entities/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountGroup, Company, User, AccountsLedger, Voucher, Inventory])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}

