import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../../../shared/entities/admin.entity';

interface JwtPayload {
  adminId: string;
  email: string
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      
      if(!decoded.adminId || !decoded.adminId == null) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      const admin = await this.adminRepository.findOne({ where: { id: decoded.adminId } });
      if (!admin) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      req.adminId = admin.id;
      req.admin = admin;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
