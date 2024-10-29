import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { User } from '../../common/user.decorator';
import { Customers } from '@prisma/client';
import { AuthGuard } from '../../common/auth.guard';

@Controller('api/v1/account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('orders')
  async getOrders(@User() user: Customers) {
    return await this.accountService.getCustomerOrders(user);
  }
}
