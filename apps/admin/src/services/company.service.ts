import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { Company } from "../../../shared/entities/company.entity";

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) { }

  async searchCompany(body: { startDate: string, endDate: string, page: number, limit: number }) {
    try {
      const { startDate, endDate, page = 1, limit = 10 } = body;

      let filter: any = {};

      if (startDate) {
        const startDateObj = new Date(startDate);
        startDateObj.setHours(0, 0, 0, 0);
        filter.createdAt = MoreThanOrEqual(startDateObj);
      }

      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        filter.createdAt = LessThanOrEqual(endDateObj);
      }

      const [companies, total] = await this.companyRepository.findAndCount({
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
      });
      return { companies, total, totalPages: Math.ceil(total / limit) };
    } catch (error) {
      throw new Error(error);
    }
  }
}