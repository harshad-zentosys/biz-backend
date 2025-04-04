import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { User } from "../../../shared/entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async searchUser(body: { startDate: string, endDate: string, page: number, limit: number, isVerified: boolean }) {
    try {
      const { startDate, endDate, page = 1, limit = 10, isVerified } = body;

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

      if (isVerified !== undefined) {
        filter.isVerified = isVerified;
      }
      const [users, total] = await this.userRepository.findAndCount({
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
      });

      return { users, total, totalPages: Math.ceil(total / limit) };
    } catch (error) {
      throw new Error(error);
    }
  }
}

