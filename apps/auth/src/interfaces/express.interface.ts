import { Request } from 'express';
import { User } from '../../../shared/entities/user.entity';
import { Company } from '../../../shared/entities/company.entity';

export interface RequestWithUser extends Request {
  user: User;
  userId: string;
} 

export interface RequestWithUserAndCompany extends RequestWithUser {
  company: Company;
  companyId: string;
} 
