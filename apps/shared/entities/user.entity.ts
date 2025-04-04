import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany, 
  Generated, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Customer } from './customer.entity';
import { USER_ROLES, USER_STATUSES } from '../constants/constants';
import { UserDevice } from './user-device.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Generated('increment')
  @Column({ unique: true, type: 'bigint' })
  userId: number;

  @Column({ type: 'enum', enum: USER_ROLES, default: USER_ROLES.OWNER })
  role: USER_ROLES;

  @Column({ unique: true, type: 'bigint' })
  mobile: number;

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true, type: 'timestamp' })
  otpExpiry: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'enum', enum: USER_STATUSES, default: USER_STATUSES.ACTIVE })
  status: USER_STATUSES;

  @ManyToOne(() => Customer, (customer) => customer.users, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: 'customer' })
  customer: Customer | null;

  @OneToMany(() => UserDevice, (userDevice) => userDevice.user, { onDelete: "SET NULL", nullable: true })
  userDevices: UserDevice[];  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
