import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../../shared/entities/company.entity';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const companyId = req.headers['companyid'] as string;

    if (!companyId) {
      throw new ForbiddenException('Company ID is missing in headers');
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new ForbiddenException('Company not found');
    }

    req.company = company;

    return true;
  }
}
