import { Customer } from "../../../shared/entities/customer.entity";
import { Injectable } from "@nestjs/common";
import { LessThanOrEqual, Like, MoreThanOrEqual, Repository, Between, Raw } from "typeorm";
import { User } from "../../../shared/entities/user.entity";
import { Company } from "../../../shared/entities/company.entity";
import { UserDevice } from "../../../shared/entities/user-device.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(UserDevice)
    private readonly userDeviceRepository: Repository<UserDevice>,
  ) {}  

  createDateFilter(startDate: string, endDate: string, alias: string) {
    let filter: any = {};
    if(startDate && endDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      filter[alias] = Between(startDateObj, endDateObj);
    }
    else if(startDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
      filter[alias] = MoreThanOrEqual(startDateObj);
    }
    else if(endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      filter[alias] = LessThanOrEqual(endDateObj);
    }
    return filter; 
  }

  async searchCustomer(body: { startDate: string, endDate: string, query: string, page: number, limit: number }) {
    try {
      const { startDate, endDate, query = "", page = 1, limit = 10 } = body;

      let filter: any = {};  
      if (query) {
        filter.mobile = Raw(alias => `CAST(${alias} AS TEXT) ILIKE '%${query}%'`);
      }
      let dateFilter = this.createDateFilter(startDate, endDate, "createdAt");
      filter = { ...filter, ...dateFilter };
      const [customers, total] = await this.customerRepository.findAndCount({
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
        relations: ['address']
      });

      return { customers, total, totalPages: Math.ceil(total / limit) };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCustomerById(id: string) {
    try {
      const customer = await this.customerRepository.findOne({ where: { id }, relations: ['address'] });
      if (!customer) {
        throw new Error("Customer not found");
      }
      return customer;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUsersByCustomerId(body: { id: string, startDate: string, endDate: string, page: number, limit: number }) {
    try {
      const { id, startDate, endDate, page = 1, limit = 10 } = body;
      if (!id) {
        throw new Error("Customer id is required");
      }
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        throw new Error("Customer not found");
      }

      let filter: any = { customer: { id } };
      let dateFilter = this.createDateFilter(startDate, endDate, "createdAt");
      filter = { ...filter, ...dateFilter };

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
  
  async getCompaniesByCustomerId(body: { id: string, startDate: string, endDate: string, page: number, limit: number }) {
    try {
      const { id, startDate, endDate, page = 1, limit = 10 } = body;
      if (!id) {
        throw new Error("Customer id is required");
      }
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        throw new Error("Customer not found");
      }
      
      let filter: any = { customer: { id } };
      let dateFilter = this.createDateFilter(startDate, endDate, "createdAt");
      filter = { ...filter, ...dateFilter };  
      
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

  async getDevicesByCustomerId(body: { id: string, startDate: string, endDate: string, page: number, limit: number }) {
    try {
      const { id, startDate, endDate, page = 1, limit = 10 } = body;
      if (!id) {
        throw new Error("Customer id is required");
      }
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        throw new Error("Customer not found");
      }

      let filter: any = { customer: { id } };
      let dateFilter = this.createDateFilter(startDate, endDate, "registeredOn");
      filter = { ...filter, ...dateFilter };

      const [devices, total] = await this.userDeviceRepository.findAndCount({
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
      });
      return { devices, total, totalPages: Math.ceil(total / limit) };

    } catch (error) {
      throw new Error(error);
    }
  }
}

