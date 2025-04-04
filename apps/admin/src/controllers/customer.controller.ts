import { Controller, Get, HttpStatus, Post, Body, UseGuards, HttpCode, Res } from "@nestjs/common";
import { CustomerService } from "../services/customer.service";
import { AuthGuard } from "../guards/auth.guard";
import { Response } from 'express';

@Controller("customer")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post("search")
  @UseGuards(AuthGuard)
  async searchCustomer(@Body() body: { startDate: string, endDate: string, query: string, page: number, limit: number }, @Res() res: Response) {
    try {
        const { startDate, endDate, query, page, limit } = body;
        const customers = await this.customerService.searchCustomer({ startDate, endDate, query, page, limit });
        return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message: "Customers fetched successfully",
            record: customers
        })
    } catch (error) {
        console.log(error);
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "Internal server error";
        return res.status(status).json({status, message})
    }
  }

  @Post("getCustomerById")
  @UseGuards(AuthGuard)
  async getCustomerById(@Body() body: { id: string }, @Res() res: Response) {
    try {
      const { id } = body;
      const customer = await this.customerService.getCustomerById(id);
      return res.status(HttpStatus.OK).json(  {
        statusCode: HttpStatus.OK,
        message: "Customer fetched successfully",
        record: customer
      })
    } catch (error) {
        console.log(error);
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "Internal server error";
        return res.status(status).json({status, message})
    }
  }

  @Post("getUsersByCustomerId")
  @UseGuards(AuthGuard)
  async getUsersByCustomerId(@Body() body: { id: string, startDate: string, endDate: string, page: number, limit: number }, @Res() res: Response) {
    try {
      const { id, startDate, endDate, page, limit } = body;
      const users = await this.customerService.getUsersByCustomerId({ id, startDate, endDate, page, limit });
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Users fetched successfully",
        record: users
      })
    } catch (error) {
        console.log(error);
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "Internal server error";
        return res.status(status).json({status, message})
    }
  }

  @Post("getCompaniesByCustomerId")
  @UseGuards(AuthGuard)
  async getCompaniesByCustomerId(@Body() body: { id: string, startDate: string, endDate: string, page: number, limit: number }, @Res() res: Response) {
    try {
      const { id, startDate, endDate, page, limit } = body;
      const companies = await this.customerService.getCompaniesByCustomerId({ id, startDate, endDate, page, limit });
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Companies fetched successfully",
        record: companies
      })
    } catch (error) {
        console.log(error);
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "Internal server error";
        return res.status(status).json({status, message})
    }
  }

  @Post("getDevicesByCustomerId")
  @UseGuards(AuthGuard)
  async getDevicesByCustomerId(@Body() body: { id: string, startDate: string, endDate: string, page: number, limit: number }, @Res() res: Response) {
    try {
      const { id, startDate, endDate, page, limit } = body;
      const devices = await this.customerService.getDevicesByCustomerId({ id, startDate, endDate, page, limit });
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Devices fetched successfully",
        record: devices
      })
    } catch (error) {
        console.log(error);
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "Internal server error";
        return res.status(status).json({status, message})
    }
  }
}