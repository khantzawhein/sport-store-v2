import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { ConfigService } from '@nestjs/config';
import { PaginatedProductsResponseDto } from './dto/product-response.dto';
import { Category_Types } from '@prisma/client';
import { ProductResponseDto } from '../home-page/dto/product-response.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getProductBySlug(slug: string) {
    return this.mapProductToResponseDto(
      await this.prisma.products.findFirstOrThrow({
        where: { slug },
        include: {
          product_images: true,
          categories: true,
        },
      }),
    );
  }

  async getRelatedProducts(productSlug: string) {
    const product = await this.prisma.products.findFirst({
      where: { slug: productSlug },
      include: { categories: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.products.findMany({
      where: {
        NOT: { id: product.id },
        categories: {
          some: {
            category_id: {
              in: product.categories.map((category) => category.category_id),
            },
          },
        },
      },
      take: 10,
      include: {
        product_images: true,
      },
    });
  }

  async getProducts(page: number, search?: string): Promise<any> {
    const query: any = search
      ? {
          where: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        }
      : {};

    const [total, products] = await Promise.all([
      this.prisma.products.count(query),
      this.prisma.products.findMany({
        ...query,
        take: this.configService.get<number>('perPage'),
        skip: (page - 1) * this.configService.get<number>('perPage'),
        include: {
          product_images: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      }),
    ]);
    const productDto = this.mapProductsToResponseDto(products);
    return {
      products: productDto,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(
          total / this.configService.get<number>('perPage'),
        ),
        perPage: this.configService.get<number>('perPage'),
        total,
      },
    };
  }

  async getProductsByCategory(
    categorySlug: string,
    page: number,
  ): Promise<PaginatedProductsResponseDto> {
    const category = await this.prisma.categories.findFirst({
      where: { slug: categorySlug },
      include: {
        category_type: {
          include: {
            categories: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const query = {
      where: {
        categories: {
          some: { category_id: category.id },
        },
      },
    };

    const [total, products] = await Promise.all([
      this.prisma.products.count(query),
      this.prisma.products.findMany({
        ...query,
        take: this.configService.get<number>('perPage'),
        skip: (page - 1) * this.configService.get<number>('perPage'),
        include: {
          product_images: true,
        },
      }),
    ]);
    return {
      products,
      category,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(
          total / this.configService.get<number>('perPage'),
        ),
        perPage: this.configService.get<number>('perPage'),
        total,
      },
    };
  }

  async getCategoriesByType(
    typeSlug: string,
  ): Promise<{ name: string; slug: string }[]> {
    const categoryType = await this.prisma.category_Types.findFirst({
      where: { slug: typeSlug },
      include: {
        categories: {
          select: { slug: true, name: true },
        },
      },
    });

    return (
      categoryType?.categories.map((category) => {
        return { name: category.name, slug: category.slug }
      }) ?? []
    );
  }

  async getCategoryTypes(): Promise<Category_Types[]> {
    return this.prisma.category_Types.findMany();
  }

  mapProductsToResponseDto(products: unknown[]): ProductResponseDto[] {
    return products.map((product) => this.mapProductToResponseDto(product));
  }

  mapProductToResponseDto(product: any): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      images: product.product_images?.map((image) => image.image_path) || [],
      categories:
        product.categories?.map((category) => category.category?.name) || [],
      price: product.price,
      discountPrice: product.promotional_price,
      description: product.description,
    };
  }
}
