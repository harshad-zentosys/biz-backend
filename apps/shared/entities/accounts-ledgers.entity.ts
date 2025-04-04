import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn, 
  JoinColumn 
} from 'typeorm';
import { AccountGroup } from './account-groups.entity';
import { Company } from './company.entity';
import { Customer } from './customer.entity';

@Entity('accounts_ledgers')
export class AccountsLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  ledgerId: string;

  @Column({ type: 'varchar', nullable: false })
  ledgerName: string;

  @Column({ type: 'varchar', nullable: true })
  groupId: string;

  @Column({ type: 'varchar', nullable: true })
  group: string;

  @ManyToOne(() => AccountGroup, (accountGroup) => accountGroup.accountsLedgers, { nullable: false })
  @JoinColumn({ name: "accountGroup" })
  accountGroup: AccountGroup;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: false })
  openingBalance: number;

  @ManyToOne(() => Company, { nullable: false })
  @JoinColumn({ name: "company" })
  company: Company;

  @ManyToOne(() => Customer, { nullable: false })
  @JoinColumn({ name: "customer" })
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
