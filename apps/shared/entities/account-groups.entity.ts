import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn, 
  JoinColumn, 
  OneToMany
} from 'typeorm';
import { Company } from './company.entity';
import { AccountsLedger } from './accounts-ledgers.entity';
import { Customer } from './customer.entity'; 

@Entity('account_groups')
export class AccountGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  groupId: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  basename: string;

  @Column({ type: 'varchar', nullable: true })
  parent: string;

  @Column({ type: 'varchar', nullable: true })
  primaryGroup: string;
 
  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @ManyToOne(() => Company, { nullable: false })
  @JoinColumn({ name: "company" })
  company: Company;

  @ManyToOne(() => Customer, { nullable: false })
  @JoinColumn({ name: "customer" })
  customer: Customer;

  @OneToMany(() => AccountsLedger, (accountsLedger) => accountsLedger.accountGroup, { onDelete: "SET NULL", nullable: true })
  accountsLedgers: AccountsLedger[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
