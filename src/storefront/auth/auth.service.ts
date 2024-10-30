import { HttpException, Inject, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../../prisma.service';
import { compareSync, hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Customers } from '@prisma/client';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  @Inject()
  private prisma: PrismaService;
  @Inject()
  private configService: ConfigService;

  async signup(data: SignupDto) {
    const customer = await this.prisma.customers.create({
      data: {
        name: data.full_name,
        email: data.email,
        password: hashSync(data.password, 10),
        phone: data.phone,
        address: data.address,
      },
    });

    const token = this.generateToken(customer);

    return this.mapResponseDto(customer, token);
  }

  async login(email: string, password: string) {
    const customer = await this.prisma.customers.findFirst({
      where: {
        email,
      },
    });

    if (!customer || !compareSync(password, customer.password)) {
      throw new HttpException('Invalid credentials', 422);
    }

    const token = this.generateToken(customer);
    return this.mapResponseDto(customer, token);
  }

  private generateToken(customer: Customers) {
    return sign(
      {
        sub: customer.id,
        name: customer.name,
      },
      this.configService.get<string>('jwtSecret'),
      {
        expiresIn: '7d',
      },
    );
  }

  private mapResponseDto(customer: Customers, token: string): LoginResponseDto {
    const responseDto = new LoginResponseDto();
    responseDto.token = token;
    responseDto.customer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    };

    return responseDto;
  }
}
