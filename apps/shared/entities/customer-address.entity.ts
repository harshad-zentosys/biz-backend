import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('customer_addresses')
export class CustomerAddress {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', nullable: false, default: 'india' })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  state: string;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  pincode: string;

  @Column({ type: 'bigint', nullable: true })
  telephone: number;

  @Column({ type: 'varchar', nullable: true })
  website: string;
  
  @Column({ type: 'varchar', nullable: true })
  address: string;

  @OneToOne(() => Customer, (customer) => customer.address, { onDelete: "SET NULL", nullable: true })
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
