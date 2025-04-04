import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { AccountGroup } from '../entities/account-groups.entity';
import { AccountsLedger } from '../entities/accounts-ledgers.entity';
import { Voucher } from '../entities/vouchers.entity';
import { Inventory } from '../entities/inventory.entity';
import { Admin } from '../entities/admin.entity';
import { CustomerAddress } from '../entities/customer-address.entity';
import { Plans } from '../entities/plans.entity';
import { Payments } from '../entities/payments.entity';
import { Customer } from '../entities/customer.entity';
import { UserDevice } from '../entities/user-device.entity';
const isDev = process.env.NODE_ENV as string === 'dev';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as 'postgres' ?? 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'mysecretpassword',
  database: process.env.DB_NAME ?? 'multi_tenant_db',
  entities: [
    User,
    Company,
    AccountGroup,
    AccountsLedger,
    Voucher,
    Inventory,
    Customer,
    UserDevice,
    CustomerAddress,
    Admin,
    Plans,
    Payments,
  ],
  synchronize: isDev,
  logging: isDev,
  migrations: ['src/migrations/*.ts'],
}; 