import { Controller, Post, Body, UseGuards, Req, HttpStatus, BadRequestException, HttpCode, Res } from '@nestjs/common';
import { SyncService } from '../services/sync.service';
import { RequestWithUserAndCompany } from '../interfaces/express.interface';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '../guards/auth.guard';
import { UserCompanyGuard } from '../guards/user-company.guard';
import { Response } from 'express';

@Controller('sync')
@Throttle({ default: { limit: 3, ttl: 60000 } })
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('account-groups')
  @UseGuards(AuthGuard, UserCompanyGuard)
  async syncAccountGroups(@Req() req: RequestWithUserAndCompany, @Body() body: { accountGroups: any[] }, @Res() res: Response) {
    try {
      const syncedRecords = await this.syncService.syncAccountGroups(req, body.accountGroups);
      return res.status(HttpStatus.OK).json({
        message: 'Account groups synced successfully',
        syncedRecords,
        status: HttpStatus.OK
      })
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({message: error.message, status: HttpStatus.BAD_REQUEST})
      }
      const message = error.message || 'Something went wrong during account groups sync';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message, status: HttpStatus.INTERNAL_SERVER_ERROR})
    }
  }

  @Post('ledgers')
  @UseGuards(AuthGuard, UserCompanyGuard)
  async syncLedgers(@Req() req: RequestWithUserAndCompany, @Body() body: { ledgers: any[] }, @Res() res: Response) {
    try {
      const syncedRecords = await this.syncService.syncLedgers(req, body.ledgers);
      return res.status(HttpStatus.OK).json({
        message: 'Ledgers synced successfully',
        syncedRecords,
        status: HttpStatus.OK
      })
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({message: error.message, status: HttpStatus.BAD_REQUEST})
      }
      const message = error.message || 'Something went wrong during ledgers sync';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message, status: HttpStatus.INTERNAL_SERVER_ERROR})
    }
  }

  @Post('vouchers')
  @UseGuards(AuthGuard, UserCompanyGuard)
  async syncVouchers(@Req() req: RequestWithUserAndCompany, @Body() body: { vouchers: any[] }, @Res() res: Response) {
    try {
      const syncedRecords = await this.syncService.syncVouchers(req.company, body.vouchers);
      return res.status(HttpStatus.OK).json({
        message: 'Vouchers synced successfully',
        syncedRecords,
        status: HttpStatus.OK
      })
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({message: error.message, status: HttpStatus.BAD_REQUEST})
      }
      const message = error.message || 'Something went wrong during vouchers sync';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message, status: HttpStatus.INTERNAL_SERVER_ERROR})
    }
  }

  @Post('inventory')
  @UseGuards(AuthGuard, UserCompanyGuard)
  async syncInventory(@Req() req: RequestWithUserAndCompany, @Body() body: { inventoryItems: any[] }, @Res() res: Response) {
    try {
      const syncedRecords = await this.syncService.syncInventory(req.company, body.inventoryItems);
      return res.status(HttpStatus.OK).json({
        message: 'Inventory synced successfully',
        syncedRecords,
        status: HttpStatus.OK
      })
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({message: error.message, status: HttpStatus.BAD_REQUEST})
      }
      const message = error.message || 'Something went wrong during inventory sync';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message, status: HttpStatus.INTERNAL_SERVER_ERROR})
    }
  }
}
