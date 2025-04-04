import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Customer } from "./customer.entity";
import { DEVICE_TYPES, DEVICE_STATUSES } from "../constants/constants";

@Entity()
export class UserDevice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  deviceId: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  deviceOS: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  deviceModel: string;

  @Column({ type: "enum", enum: DEVICE_TYPES, default: DEVICE_TYPES.APP })
  deviceType: DEVICE_TYPES;

  @Column({ type: "enum", enum: DEVICE_STATUSES, default: DEVICE_STATUSES.UNREGISTERED })
  status: DEVICE_STATUSES;
  
  @CreateDateColumn()
  registeredOn: Date;

  @UpdateDateColumn()
  lastConnected: Date;
  
  @ManyToOne(() => User, (user) => user.userDevices, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "user" })
  user: User | null;

  @ManyToOne(() => Customer, (customer) => customer.userDevices, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "customer" })
  customer: Customer | null;
}
