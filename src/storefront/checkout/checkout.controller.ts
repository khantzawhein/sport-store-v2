import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JoiValidationPipe } from '../../common/joi-validation.pipe';
import { CheckoutDto, CheckoutSchema } from './dto/checkout.dto';
import { CheckoutService } from './checkout.service';
import { AuthGuard } from '../../common/auth.guard';
import { User } from '../../common/user.decorator';
import { Customers } from '@prisma/client';

@Controller('api/v1/checkout')
@UseGuards(AuthGuard)
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Post()
  async checkout(
    @Body(new JoiValidationPipe(CheckoutSchema)) data: CheckoutDto,
    @User() user: Customers,
  ) {
    return await this.checkoutService.processCheckout(user.id, data.items);
  }
}
