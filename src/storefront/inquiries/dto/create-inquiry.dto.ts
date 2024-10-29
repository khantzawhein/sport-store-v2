// contact/dto/create-inquiry.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const schema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  message: Joi.string().required(),
});

export class CreateInquiryDto {
  @ApiProperty({ example: 'John' })
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '+1234567890' })
  phone: string;

  @ApiProperty({ example: 'I would like to inquire about...' })
  message: string;
}
