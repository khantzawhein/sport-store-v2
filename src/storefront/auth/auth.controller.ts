import { Body, Controller, Inject, Post, Res, UsePipes } from '@nestjs/common';

import { schema as SignUpSchema, SignupDto } from './dto/signup.dto';
import { LoginDto, schema as LoginSchema } from './dto/login.dto';
import { Response } from 'express';
import { JoiValidationPipe } from '../../common/joi-validation.pipe';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  @Inject()
  private authService: AuthService;

  @UsePipes(new JoiValidationPipe(LoginSchema))
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { email, password } = body;
    const result = await this.authService.login(email, password);

    return res.status(200).json(result);
  }

  @UsePipes(new JoiValidationPipe(SignUpSchema))
  @Post('signup')
  async signup(@Body() data: SignupDto, @Res() res: Response) {
    const result = await this.authService.signup(data);
    return res.status(200).json(result);
  }
}
