import { AuthGuard } from "../guards/auth.guard";
import { UserService } from "../services/user.service";
import { BadRequestException, Controller, Get, HttpStatus, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('search')
  @UseGuards(AuthGuard)
  async search(@Query() query: any, @Res() res: Response) {
    try {
      const result = await this.userService.searchUser(query);
      return res.status(HttpStatus.OK).json({
        message: 'User search successful',
        record: result,
        status: HttpStatus.OK
      });
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        return { message: error.message, status: HttpStatus.BAD_REQUEST };
      }
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Something went wrong during user search';
      return res.status(status).json({status, message});
    }
  }

}   
