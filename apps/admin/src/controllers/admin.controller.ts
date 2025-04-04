import { Controller, Post, Body, HttpStatus, HttpCode, BadRequestException, UseGuards, Req, Res } from '@nestjs/common';
import { AdminService } from "../services/admin.service"  
import { Response } from 'express';
@Controller('auth')
export class AdminController {
  constructor(
      private readonly adminService: AdminService
  ) {}

  @Post("register")
  async register(@Body() body: { email: string, password: string }, @Res() res: Response) {
    try {
      const { email, password } = body;
      const record = await this.adminService.registerAdmin(email, password);  
      return res.status(HttpStatus.OK).json({
        message: 'Admin registered successfully',
        record: record,
        status: HttpStatus.OK
      })
    } catch (error) {
      console.error(error);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Something went wrong during admin registration';
      return res.status(status).json({status, message})
    }
  }

  @Post("login")
  async login(@Body() body: { email: string, password: string }, @Res() res: Response) {
    try {
      const { email, password } = body;
      const { admin, token } = await this.adminService.login(email, password);
      return res.status(HttpStatus.OK).json({
        message: 'Admin logged in successfully',
        record: admin,
        token: token,
        status: HttpStatus.OK
      })
    } catch (error) {
      console.error(error);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Something went wrong during admin login';
      return res.status(status).json({status, message})
    }
  } 
}