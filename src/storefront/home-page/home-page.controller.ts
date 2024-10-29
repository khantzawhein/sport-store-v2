// home-page.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HomePageService } from './home-page.service';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('api/v1')
export class HomePageController {
  constructor(private readonly homePageService: HomePageService) {}

  @Get('homepage')
  async getHomePageData(): Promise<{
    newProducts: ProductResponseDto[];
    featuredProducts: ProductResponseDto[];
  }> {
    const [newProducts, featuredProducts] = await Promise.all([
      this.homePageService.getNewProducts(),
      this.homePageService.getFeaturedProducts(),
    ]);

    return {
      newProducts,
      featuredProducts,
    };
  }
}