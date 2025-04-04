import { Admin } from "../../../shared/entities/admin.entity";  
import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { validateEmail } from "../../../shared/helper/validation";
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class AdminService {
  private readonly rounds: number;
  constructor(
    @InjectRepository(Admin)
      private readonly adminRepository: Repository<Admin>,
  ) {
    this.rounds = 10;
  }

  async registerAdmin(email: string, password: string) {
    try {
      if(!email || !validateEmail(email)) {
        throw new BadRequestException('Invalid email');
      }

      if(!password) {
        throw new BadRequestException('Password is required');
      }

      const existingAdmin = await this.adminRepository.findOneBy({ email });
      if(existingAdmin) {
        throw new BadRequestException('Admin already exists');
      }

      const hashedPassword = await bcrypt.hash(password, this.rounds);

      const admin = this.adminRepository.create({ email, password: hashedPassword });
      await this.adminRepository.save(admin);

      const { password: _, ...adminWithoutPassword } = admin;
      return adminWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      if(!email || !validateEmail(email)) {
        throw new BadRequestException('Invalid email');
      }

      if(!password) {
        throw new BadRequestException('Password is required');
      }

      // fetch admin by email with password 
      const existingAdmin = await this.adminRepository.findOneBy({ email });
      if(!existingAdmin) {
        throw new BadRequestException('Admin not found');
      }

      const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);
      if(!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      const token = jwt.sign({ adminId: existingAdmin.id, email: existingAdmin.email }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
      const { password: _, ...adminWithoutPassword } = existingAdmin;

      return { token, admin: adminWithoutPassword };
    } catch (error) {
      throw error;
    }
  }
}

