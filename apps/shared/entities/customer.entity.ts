import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Company } from "./company.entity";
import { UserDevice } from "./user-device.entity";
import { CustomerAddress } from "./customer-address.entity";
@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "bigint", nullable: false })
  mobile: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;
  
  @Column({ type: "varchar", length: 255, nullable: true })
  partnerCode: string;

  @OneToMany(() => User, (user) => user.customer, { onDelete: "CASCADE", nullable: true })
  users: User[];

  @OneToMany(() => UserDevice, (userDevice) => userDevice.customer, { onDelete: "CASCADE", nullable: true })
  userDevices: UserDevice[];

  @OneToMany(() => Company, (company) => company.customer, { onDelete: "CASCADE", nullable: true })
  companies: Company[];

  @OneToOne(() => CustomerAddress, (address) => address.customer, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "address" })
  address: CustomerAddress;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()   
  updatedAt: Date;
}
