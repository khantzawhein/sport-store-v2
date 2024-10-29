import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SaleDto } from './dto/account.dto';
import { Customers } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getCustomerOrders(user: Customers): Promise<SaleDto[]> {
    const sales = await this.prisma.sales.findMany({
      where: {
        customer_id: user.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return sales.map((sale) => ({
      id: sale.id,
      total_items: sale.total_items,
      total_price: sale.total_price,
      created_at: sale.created_at,
    }));
  }
}
