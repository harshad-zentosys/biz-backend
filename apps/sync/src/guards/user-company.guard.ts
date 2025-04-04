import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../../shared/entities/company.entity';

@Injectable()
export class UserCompanyGuard implements CanActivate {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const customerId = req.customer?.id;
    const companyId = req.headers['companyid'] as string;

    if (!companyId) {
      throw new ForbiddenException('Company ID is missing in headers');
    }

    console.log('companyId', companyId);
    console.log('customerId', customerId);

    const company = await this.companyRepository.findOne({
      where: { id: companyId, customer: { id: customerId } },
      relations: ['customer'],
    });

    console.log('company', company);

    if (!company) {
      throw new ForbiddenException('User does not belong to this company');
    }

    req.company = company;

    return true;
  }
}
