import { Injectable } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'WiseCalK Backend API is running! 💰📊';
  }

  async getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      message: 'WiseCalK Backend is healthy!',
    };
  }

  async getDbHealth() {
    try {
      // Test database connection by counting users
      const userCount = await this.prisma.user.count();
      const currencyCount = await this.prisma.currency.count();

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          users: userCount,
          currencies: currencyCount,
        },
        message: 'Database connection is healthy!',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: error.message,
        },
        message: 'Database connection failed!',
      };
    }
  }
}
