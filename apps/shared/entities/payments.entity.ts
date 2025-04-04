import { Plans } from "./plans.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PAYMENT_STATUSES } from "../constants/constants";
import { Customer } from "./customer.entity";

@Entity()
export class Payments {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  transactionId: string;

  @OneToOne(() => Customer, (customer) => customer.id, { onDelete: "SET NULL", nullable: false })
  @JoinColumn({ name: "customer" })
  customer: Customer;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  amount: number;

  @OneToOne(() => Plans, (plan) => plan.id, { onDelete: "SET NULL", nullable: false })
  @JoinColumn({ name: "plan" })
  plan: Plans;

  @Column({ type: "timestamp", nullable: false })
  paymentDate: Date;

  @Column({ type: "varchar", length: 255, nullable: false })
  paymentMethod: string;

  @Column({ type: "enum", enum: PAYMENT_STATUSES, default: PAYMENT_STATUSES.PENDING })
  status: PAYMENT_STATUSES;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

