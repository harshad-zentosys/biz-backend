import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../../shared/entities/company.entity';
import { USER_ROLES } from '../../../shared/constants/constants';

@Injectable()
export class CustomerCompanyGuard implements CanActivate {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.userId;
    const user = req.user;
    const companyId = req.headers['companyid'] as string;

    if (!companyId) {
      throw new ForbiddenException('Company ID is missing in headers');
    }

    if (!userId) {
      throw new ForbiddenException('Invalid token');
    }

    if(!user.company || user.role != USER_ROLES.OWNER) {
      throw new ForbiddenException('You are not authorized to perform this action');
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId, customer: { id: companyId } },
      relations: ['customer'],
    });

    if (!company) {
      throw new ForbiddenException('Unauthorized access: Customer does not belong to this company');
    }

    req.company = company;
    req.customer = company.customer;

    return true;
  }
}
