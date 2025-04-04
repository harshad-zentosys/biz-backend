import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  Generated, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { FinancialYearsTransformer } from '../helper/helper';

@Entity()
export class Company {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Generated('increment')
  @Column({ unique: true, type: 'bigint' })
  companyId: number;

  @ManyToOne(() => Customer, (customer) => customer.companies, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "customer" })
  customer: Customer | null;

  @Column({ type: 'varchar', nullable: false })
  companyName: string;

  @Column({ type: 'varchar', nullable: true })
  mailingName: string;

  @Column({ type: 'varchar', nullable: false })
  companyNumber: string;

  @Column({ type: 'varchar', nullable: false })
  guid: string;

  @Column('text', { 
    array: true, 
    default: '{}', 
    transformer: FinancialYearsTransformer,
  })
  financialYears: string[]; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
