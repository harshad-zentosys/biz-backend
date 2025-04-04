import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { AuthGuard } from '../guards/auth.guard';
import { RequestWithUser } from '../interfaces/express.interface';
import { CustomerGuard } from '../guards/customer.guard';
import { Response } from 'express';
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('create')
  @UseGuards(AuthGuard, CustomerGuard)
  async createCompany(
    @Req() req: RequestWithUser,
    @Body()
    body: {
      companyName: string;
      mailingName: string;
      companyNumber: string;
      guid: string;
    },
    @Res() res: Response
  ) {
    try {
      const { companyName, mailingName, companyNumber, guid } = body;
      const record = await this.companyService.createCompany(
        req.user,
        companyName,
        mailingName,
        companyNumber,
        guid,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Company created successfully',
        record: record,
        status: HttpStatus.OK,
      });
    } catch (error) {
      console.error(error);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Something went wrong during company creation';
      return res.status(status).json({status, message});
    }
  }
}
