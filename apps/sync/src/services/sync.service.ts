import { Company } from '../../../shared/entities/company.entity';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccountGroup } from '../../../shared/entities/account-groups.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsLedger } from '../../../shared/entities/accounts-ledgers.entity';
import { Voucher } from '../../../shared/entities/vouchers.entity';
import { Inventory } from '../../../shared/entities/inventory.entity';
import { ConfigService } from '@nestjs/config';
import { PRIMARY_GROUP_KEYS } from '../../../shared/constants/constants';
import { RequestWithUserAndCompany } from '../interfaces/express.interface';
import { PRIMARY_GROUPS } from '../../../shared/constants/constants';
@Injectable()
export class SyncService {
  private readonly syncLimit: number;

  constructor(
    @InjectRepository(AccountGroup)
    private accountGroupRepository: Repository<AccountGroup>,
    @InjectRepository(AccountsLedger)
    private ledgerRepository: Repository<AccountsLedger>,
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private configService: ConfigService,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {
    this.syncLimit = this.configService.get<number>('SYNC_LIMIT', 1000);
  }
  // Sync Account Groups
  async syncAccountGroups(req: RequestWithUserAndCompany, accountGroups: any[]) {
    try {
      if (!accountGroups || !Array.isArray(accountGroups) || accountGroups.length === 0) {
        throw new Error('No account groups to sync');
      }
      const company = req.company;
      const customer = req.customer;
      accountGroups = accountGroups.slice(0, this.syncLimit);
      let syncedRecords = 0;

      for (const group of accountGroups) {
        if (!group.name) continue;
        const basename = group.name.trim().toLowerCase().replace(/ /g, '');
        const _parent = group.parent ? group.parent.trim().toLowerCase().replace(/ /g, '') : null;
        const _isPrimary = PRIMARY_GROUP_KEYS.includes(_parent);

        let accountGroup = await this.accountGroupRepository.findOne({ where: { basename, company: { id: company.id } } });
        if (accountGroup) {
          accountGroup.parent = _isPrimary ? null : _parent;
          accountGroup.primaryGroup = _isPrimary ? null : _parent;
          accountGroup.isPrimary = _isPrimary;
          accountGroup = await this.accountGroupRepository.save(accountGroup);
        } else {
          const newAccountGroup = new AccountGroup();
          newAccountGroup.groupId = group.id;
          newAccountGroup.name = group.name;
          newAccountGroup.basename = basename;
          newAccountGroup.company = company;
          newAccountGroup.customer = customer;
          newAccountGroup.parent = _isPrimary ? null : _parent;
          newAccountGroup.primaryGroup = _isPrimary ? null : _parent;
          newAccountGroup.isPrimary = _isPrimary;
          accountGroup = await this.accountGroupRepository.save(newAccountGroup);
        }
        syncedRecords++;
      }
  
      return syncedRecords;
    } catch (error) {
      console.error('Error syncing account groups:', error);
      throw new BadRequestException('Error syncing account groups');
    }
  }

  // Sync Ledgers
  async syncLedgers(req: RequestWithUserAndCompany, ledgers: any[]) {
    try {
      if (!ledgers || !Array.isArray(ledgers) || ledgers.length === 0) {
        throw new Error('No ledgers to sync');
      }
      const company = req.company;
      const customer = req.customer;
      ledgers = ledgers.slice(0, this.syncLimit);
      let syncedRecords = 0;

      for (const ledger of ledgers) {
        const accountGroup = await this.accountGroupRepository.findOne({ where: { groupId: ledger.groupId, company: { id: company.id } } });
        if (!accountGroup) {
          console.log(`Account group not found for ledger ${ledger.ledgerName}`);
          continue;
        }

        const existingLedger = await this.ledgerRepository.findOne({ 
          where: { 
            ledgerId: ledger.id, 
            groupId: ledger.groupId, 
            company: { id: company.id } 
          } 
        });
        
        if (existingLedger) {
          existingLedger.ledgerName = ledger.ledgerName;
          existingLedger.openingBalance = ledger.openingBalance;
          await this.ledgerRepository.save(existingLedger);
        } else {
          const newLedger = new AccountsLedger();
          newLedger.ledgerName = ledger.ledgerName;
          newLedger.ledgerId = ledger.id;
          newLedger.groupId = ledger.groupId; 
          newLedger.group = accountGroup.primaryGroup ? accountGroup.primaryGroup : accountGroup.basename;
          newLedger.company = company;
          newLedger.customer = customer;
          newLedger.openingBalance = ledger.openingBalance;
          newLedger.accountGroup = accountGroup;
          await this.ledgerRepository.save(newLedger);
        }
        syncedRecords++;
      }

      return syncedRecords;
    } catch (error) {
      console.error('Error syncing ledgers:', error);
      throw new BadRequestException('Error syncing ledgers');
    }
  }

  // Sync Vouchers
  async syncVouchers(company: Company, vouchers: any[]) {
    try {
      if (!vouchers || !Array.isArray(vouchers) || vouchers.length === 0) {
        throw new Error('No vouchers to sync');
      }
      vouchers = vouchers.slice(0, this.syncLimit);
      let syncedRecords = 0;

      for (const voucherData of vouchers) {
        const ledger = await this.ledgerRepository.findOne({ where: { company: { id: company.id } } });
        if (!ledger) {
          console.log(`Ledger not found for voucher ${voucherData.voucherNumber}`);
          continue;
        }

        const existingVoucher = await this.voucherRepository.findOne({ where: { voucherNumber: voucherData.voucherNumber, company: { id: company.id } } });
        if (existingVoucher) {
          existingVoucher.voucherType = voucherData.voucherType;
          existingVoucher.date = voucherData.date;
          existingVoucher.amount = voucherData.amount;
          await this.voucherRepository.save(existingVoucher);
        } else {
          const newVoucher = new Voucher();
          newVoucher.voucherType = voucherData.voucherType;
          newVoucher.voucherNumber = voucherData.voucherNumber;
          newVoucher.date = voucherData.date;
          newVoucher.amount = voucherData.amount;
          newVoucher.ledgerId = voucherData.ledgerId;
          newVoucher.company = company;
          await this.voucherRepository.save(newVoucher);
        }
        syncedRecords++;
      }

      return syncedRecords;
    } catch (error) {
      console.error('Error syncing vouchers:', error);
      throw new BadRequestException('Error syncing vouchers');
    }
  }

  // Sync Inventory
  async syncInventory(company: Company, inventoryItems: any[]) {
    try {
      if (!inventoryItems || !Array.isArray(inventoryItems) || inventoryItems.length === 0) {
        throw new Error('No inventory items to sync');
      }
      inventoryItems = inventoryItems.slice(0, this.syncLimit);
      let syncedRecords = 0;

      for (const inventoryItem of inventoryItems) {
        const existingInventory = await this.inventoryRepository.findOne({ where: { thirdPartyId: inventoryItem.id, company: { id: company.id } } });
        if (existingInventory) {
          existingInventory.productName = inventoryItem.productName;
          existingInventory.stock = inventoryItem.stock;
          existingInventory.rate = inventoryItem.rate;
          await this.inventoryRepository.save(existingInventory);
        } else {
          const newInventory = new Inventory();
          newInventory.productName = inventoryItem.productName;
          newInventory.stock = inventoryItem.stock;
          newInventory.rate = inventoryItem.rate;
          newInventory.thirdPartyId = inventoryItem.id
          newInventory.company = company;
          await this.inventoryRepository.save(newInventory);
        }
        syncedRecords++;
      }

      return syncedRecords;
    } catch (error) {
      console.error('Error syncing inventory:', error);
      throw new BadRequestException('Error syncing inventory');
    }
  }
}
