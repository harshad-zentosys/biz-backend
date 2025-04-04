import { CompanyService } from "../services/company.service";
import { Controller, Get, HttpStatus, Query, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { Response } from 'express';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Get('search')
  @UseGuards(AuthGuard)
  async search(@Query() query: any, @Res() res: Response) {
    try {
      const result = await this.companyService.searchCompany(query);
      return res.status(HttpStatus.OK).json({
        message: 'Company search successful',
        record: result,
        status: HttpStatus.OK
      })
    } catch (error) {
      console.error(error);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Something went wrong during company search';
      return res.status(status).json({status, message})
    }
  }

}

