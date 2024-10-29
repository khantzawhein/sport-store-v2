import { HttpException, Inject, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../../prisma.service';
import { compareSync, hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Customers } from '@prisma/client';

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

    return {
      customer,
      token,
    };
  }

  async login(email: string, password: string) {
    const customer = await this.prisma.customers.findFirst({
      where: {
        email,
      },
    });

    if (!customer || !compareSync(password, customer.password)) {
      throw new HttpException('Invalid credentials', 401);
    }

    const token = this.generateToken(customer);

    return {
      customer,
      token,
    };
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
}
