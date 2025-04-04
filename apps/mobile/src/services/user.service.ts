import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from "../../../shared/entities/user.entity";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validateEmail } from '../../../shared/helper/validation';
import { USER_ROLES } from '../../../shared/constants/constants';
import { Company } from '../../../shared/entities/company.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}

  async addProfile(id: string, firstName: string, lastName: string, email?: string, partnerCode?: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if(user.isVerified === false) {
        throw new BadRequestException('User is not verified');
      }

      if(email && !validateEmail(email)) {
        throw new BadRequestException('Invalid email');
      }

      if(firstName) user.firstName = firstName;
      if(lastName) user.lastName = lastName;
      if(email) user.email = email;
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getDashboard(user: User) {
    try {
      if(user.role != USER_ROLES.OWNER) {
        throw new UnauthorizedException('You are not authorized to view the dashboard');
      }

      const existingUser = await this.userRepository.findOne({ where: { id: user.id }, relations: ['customer'] });
      if (!existingUser) {
        throw new BadRequestException('User not found');
      }

      if (!user.isVerified) {
        throw new BadRequestException('User is not verified');
      }

      if (!existingUser.customer) {
        throw new BadRequestException('Customer not found');
      }

      const companies = await this.companyRepository.find({
        where: { customer: { id: existingUser.customer?.id } },
        relations: ['customer'],
      });

      if (!companies) {
        throw new BadRequestException('No company found for this user');
      }

      return { 
        message: 'Dashboard data fetched successfully', 
        status: 200, 
        data: companies 
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
