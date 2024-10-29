import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule as StoreFrontAuthModule } from './storefront/auth/auth.module';
import app from './config/app';
import paginationConfig from './config/pagination.config';
import { PrismaService } from './prisma.service';
import { HomePageModule } from './storefront/home-page/home-page.module';
import { ProductsModule } from './storefront/products/products.module';
import { InquiriesModule } from './storefront/inquiries/inquiries.module';
import { CheckoutModule } from './storefront/checkout/checkout.module';
import { AccountModule } from './storefront/account/account.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [app, paginationConfig],
    }),
    StoreFrontAuthModule,
    HomePageModule,
    ProductsModule,
    InquiriesModule,
    CheckoutModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService, ConfigModule],
})
export class AppModule {}
