import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { DURATION_TYPES } from "../constants/constants";

@Entity()
export class Plans {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  cost: number;
  
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  perDeviceCost: number;

  @Column({ type: "bigint", default: 0})
  duration: number;

  @Column({ type: "enum", enum: DURATION_TYPES, default: DURATION_TYPES.DAYS })
  durationType: DURATION_TYPES;  
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
