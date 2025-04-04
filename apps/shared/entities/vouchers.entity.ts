import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn, 
  JoinColumn 
} from 'typeorm';
import { Company } from './company.entity';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  voucherType: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  voucherNumber: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  amount: number;  

  @Column({ type: 'varchar', nullable: false })
  ledgerId: string;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: "company" })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
