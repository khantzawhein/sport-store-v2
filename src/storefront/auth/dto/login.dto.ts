import * as Joi from 'joi';

export class LoginDto {
  email: string;
  password: string;
}

export const schema = Joi.object({
  email: Joi.string().email().label('Email').required(),
  password: Joi.string().min(6).required().label('Password'),
});
