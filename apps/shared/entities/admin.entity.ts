import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("admin")
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password: string;
  
}
