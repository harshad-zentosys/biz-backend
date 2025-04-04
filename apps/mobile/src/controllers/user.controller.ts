import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, UseGuards, Req, Res } from '@nestjs/common';
import { UserService } from "../services/user.service"
import { AuthGuard } from '../guards/auth.guard';
import { RequestWithUser } from '../interfaces/express.interface';
import { CustomerGuard } from '../guards/customer.guard';
import { Response } from 'express';
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  // Add profile data
  @Post('add-profile')
  @UseGuards(AuthGuard)
  async addProfile(@Req() req: RequestWithUser, @Body() body: { firstName: string, lastName: string, email?: string }, @Res() res: Response) {
    try {
      const { firstName, lastName, email } = body;
      await this.userService.addProfile(req.userId, firstName, lastName, email);
      return res.status(HttpStatus.OK).json({
        message: 'Profile added successfully',
        status: HttpStatus.OK
      })
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({message: error.message})
      }
      const errorMessage = error.message || 'Something went wrong during profile creation';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: errorMessage})
    }
  }

  @Post("dashboard")
  @UseGuards(AuthGuard, CustomerGuard)
  async getDashboard(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const dashboard = await this.userService.getDashboard(req.user);
      return res.status(HttpStatus.OK).json({
        message: 'Dashboard data fetched successfully',
        dashboard,
        status: HttpStatus.OK
      })
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({message: error.message})
      }
      const errorMessage = error.message || 'Something went wrong during dashboard data fetch';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: errorMessage})
    }
  }
}
