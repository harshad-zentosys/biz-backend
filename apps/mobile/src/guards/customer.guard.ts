import { USER_ROLES } from "../../../shared/constants/constants";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class CustomerGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const userId = req.userId;
        const user = req.user;
    
        if (!userId) {
          throw new ForbiddenException('Invalid token');
        }
    
        if (!user) {
          throw new ForbiddenException('Invalid token');
        }
    
        if (user.role != USER_ROLES.OWNER || !user.customer) {
          throw new ForbiddenException('You are not authorized to perform this action');
        }
    
        req.customer = user.customer;
    
        return true;
      }
}   
