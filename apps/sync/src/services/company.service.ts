import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../../shared/entities/company.entity';
import { User } from '../../../shared/entities/user.entity';
import { USER_ROLES } from '../../../shared/constants/constants';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCompany(
    user: User,
    companyName: string,
    mailingName: string,
    companyNumber: string,
    guid: string,
  ) {
    try {
      if (user.role != USER_ROLES.OWNER) {
        throw new UnauthorizedException(
          'You are not authorized to create a company',
        );
      }

      if (companyName == '' || !companyName) {
        throw new BadRequestException('Company name is required');
      }

      if (companyNumber == '' || !companyNumber) {
        throw new BadRequestException('Company number is required');
      }

      if (guid == '' || !guid) {
        throw new BadRequestException('GUID is required');
      }

      const existingUser = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['customer'],
      });
      if (!existingUser) {
        throw new BadRequestException('User not found');
      }

      if (!user.isVerified) {
        throw new BadRequestException('User is not verified');
      }

      const company = new Company();
      company.customer = existingUser.customer;
      company.companyName = companyName;
      company.mailingName = mailingName || companyName;
      company.companyNumber = companyNumber;
      company.guid = guid;

      const savedCompany = await this.companyRepository.save(company);

      return savedCompany;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
