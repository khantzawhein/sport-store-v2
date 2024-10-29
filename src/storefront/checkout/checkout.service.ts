import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CartItemDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async processCheckout(customerId: number, items: CartItemDto[]) {
    // Get all products in single query
    const products = await this.prisma.products.findMany({
      where: {
        id: {
          in: items.map((item) => item.product_id),
        },
      },
    });

    // Calculate totals
    const validItems = items.filter((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return product && item.quantity > 0;
    });

    if (validItems.length === 0) {
      throw new HttpException(
        'No valid items to checkout',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const total_items = validItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    const saleItems = validItems.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      const salePrice = product.promotional_price || product.price;
      return {
        product_id: product.id,
        quantity: item.quantity,
        unit_price: salePrice,
        total_price: salePrice * item.quantity,
      };
    });

    const total_price = saleItems.reduce(
      (acc, item) => acc + item.total_price,
      0,
    );

    // Create sale with items in a transaction
    const sale = await this.prisma.$transaction(async (prisma) => {
      // Create sale record
      const sale = await prisma.sales.create({
        data: {
          total_items,
          total_price,
          customer: {
            connect: {
              id: customerId,
            },
          },
          sale_items: {
            createMany: {
              data: saleItems,
            },
          },
        },
        include: {
          sale_items: true,
        },
      });

      // Update product sales counts
      await Promise.all(
        validItems.map((item) =>
          prisma.products.update({
            where: { id: item.product_id },
            data: {
              sales_count: {
                increment: item.quantity,
              },
            },
          }),
        ),
      );

      return sale;
    });

    return {
      id: sale.id,
      total_items,
      total_price,
      items: sale.sale_items,
    };
  }
}
