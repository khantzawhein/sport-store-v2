import { Injectable } from '@nestjs/common';

import { ProductResponseDto } from './dto/product-response.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class HomePageService {
  constructor(private prisma: PrismaService) {}

  private readonly productFilter = {};

  async getNewProducts(): Promise<ProductResponseDto[]> {
    const products = await this.prisma.products.findMany({
      where: {
        is_new_product: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        product_images: {
          select: {
            image_path: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return this.mapToProductResponseDto(products);
  }

  async getFeaturedProducts(): Promise<ProductResponseDto[]> {
    const products = await this.prisma.products.findMany({
      where: {
        is_featured_product: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        product_images: {
          select: {
            image_path: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return this.mapToProductResponseDto(products);
  }

  private mapToProductResponseDto(products: any[]): ProductResponseDto[] {
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.promotional_price,
      description: product.description,
      images: product.product_images.map((img) => img.image_path),
      categories: product.categories.map((category) => category.category.name),
      slug: product.slug,
    }));
  }
}
