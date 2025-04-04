import { Controller } from '@nestjs/common';
import { CompanyService } from "../services/company.service"

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService
  ) {}

}