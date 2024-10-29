import { Module } from '@nestjs/common';
import { HomePageService } from './home-page.service';
import { HomePageController } from './home-page.controller';

@Module({
  providers: [HomePageService],
  controllers: [HomePageController],
})
export class HomePageModule {}
