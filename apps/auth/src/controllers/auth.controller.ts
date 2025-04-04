import { Controller, Post, Body, HttpStatus, HttpCode, BadRequestException, Headers, UnauthorizedException, Req, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login_register')
  async loginRegister(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    try {
      const { mobile, deviceInfo } = body;
      const ip = req.ip as string;
      const token = await this.authService.loginRegister(mobile, deviceInfo, ip);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'OTP sent successfully',
        token: token
      })
    } catch (error) {
      console.error(error);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;  
      const message = error.message || 'Something went wrong during login/register';
      return res.status(status).json({status, message})
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Headers('authorization') auth: string, @Body() body: { otp: string }, @Res() res: Response) {
    try {
      const token = auth?.startsWith('Bearer ') ? auth.slice(7) : auth;
      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }
      const _token = await this.authService.verifyOtp(token, body.otp);
      return res.status(HttpStatus.OK).json({
        message: 'Login Successful',
        token: _token,
        status: HttpStatus.OK
      })
    } catch (error) {
      console.error(error);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Something went wrong during OTP verification';
      return res.status(status).json({status, message})
    }
  }
}
