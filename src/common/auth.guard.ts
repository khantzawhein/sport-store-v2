import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private configService: ConfigService;
  @Inject()
  private prisma: PrismaService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const secret = this.configService.get<string>('jwtSecret');
    let customer = null;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const claims = verify(token, secret);
      customer = await this.prisma.customers.findFirst({
        where: {
          id: parseInt(claims.sub.toString()),
        },
      });
    } catch {
      throw new UnauthorizedException();
    }

    request.user = customer;
    if (!customer) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
