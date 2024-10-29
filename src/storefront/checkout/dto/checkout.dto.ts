import * as Joi from 'joi';

export class CartItemDto {
  product_id: number;
  quantity: number;
}

export class CheckoutDto {
  items: CartItemDto[];
}

export const CheckoutSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
      }),
    )
    .required()
    .min(1),
});
