import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(auth0Id: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { auth0Id },
        select: {
          id: true,
          auth0Id: true,
          email: true,
          firstName: true,
          lastName: true,
          timezone: true,
          locale: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      this.logger.error(`Failed to validate user ${auth0Id}`, error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          auth0Id: true,
          email: true,
          firstName: true,
          lastName: true,
          timezone: true,
          locale: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      this.logger.error(`Failed to get user ${userId}`, error);
      throw error;
    }
  }

  async generateApiKey(userId: string, name: string): Promise<string> {
    const payload = {
      sub: userId,
      type: 'api_key',
      name,
      iat: Date.now(),
    };

    return this.jwtService.sign(payload, {
      expiresIn: '365d',
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async validateApiKey(apiKey: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(apiKey, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (payload.type !== 'api_key') {
        return null;
      }

      return this.getUserById(payload.sub);
    } catch (error) {
      this.logger.error('Invalid API key', error);
      return null;
    }
  }
}