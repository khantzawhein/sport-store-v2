import { HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import Joi from 'joi';

export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: unknown) {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
    });
    if (error) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: error.details.map((error) => error.message),
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return value;
  }
}
