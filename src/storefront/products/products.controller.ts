import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { PaginatedProductsResponseDto } from './dto/product-response.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductService } from './products.service';
import { Category_Types } from '@prisma/client';

@ApiTags('Products')
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'q', required: false })
  async getProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('q') search?: string,
  ): Promise<PaginatedProductsResponseDto> {
    return this.productService.getProducts(page, search);
  }

  @Get('category/:slug')
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiQuery({ name: 'page', required: false })
  async getProductsByCategory(
    @Param('slug') categorySlug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<PaginatedProductsResponseDto> {
    return this.productService.getProductsByCategory(categorySlug, page);
  }

  @Get('types/:slug')
  @ApiParam({ name: 'slug', description: 'Category type slug' })
  async getCategoryByType(
    @Param('slug') typeSlug: string,
  ): Promise<{ name: string, slug: string }[]> {
    const categorySlug =
      await this.productService.getCategoriesByType(typeSlug);
    if (!categorySlug) {
      throw new NotFoundException('Category type not found');
    }
    return categorySlug;
  }

  @Get('types')
  async getCategoryTypes(): Promise<{ types: Category_Types[] }> {
    return { types: await this.productService.getCategoryTypes() };
  }

  @Get(':slug')
  @ApiParam({ name: 'slug', description: 'Product slug' })
  async getProduct(@Param('slug') slug: string): Promise<any> {
    try {
      const [product, relatedProducts] = await Promise.all([
        this.productService.getProductBySlug(slug),
        this.productService.getRelatedProducts(slug),
      ]);

      return {
        product,
        relatedProducts,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Product not found');
    }
  }
}
