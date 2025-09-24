import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserSyncService {
  private readonly logger = new Logger(UserSyncService.name);

  constructor(private prisma: PrismaService) {}

  async syncUser(auth0Id: string, tokenPayload: any): Promise<User> {
    try {
      let user = await this.prisma.user.findUnique({
        where: { auth0Id },
      });

      if (!user) {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            auth0Id,
            email: tokenPayload.email || `${auth0Id}@wisecalk.com`,
            firstName: tokenPayload.given_name || tokenPayload.name?.split(' ')[0],
            lastName: tokenPayload.family_name || tokenPayload.name?.split(' ').slice(1).join(' '),
            timezone: tokenPayload.zoneinfo || 'UTC',
            locale: tokenPayload.locale || 'en-US',
          },
        });

        this.logger.log(`Created new user: ${user.email}`);

        // Create default categories for new user
        await this.createDefaultCategories(user.id);
      } else {
        // Update existing user with latest info
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            email: tokenPayload.email || user.email,
            firstName: tokenPayload.given_name || user.firstName,
            lastName: tokenPayload.family_name || user.lastName,
            timezone: tokenPayload.zoneinfo || user.timezone,
            locale: tokenPayload.locale || user.locale,
          },
        });
      }

      return user;
    } catch (error) {
      this.logger.error(`Failed to sync user ${auth0Id}`, error);
      throw error;
    }
  }

  private async createDefaultCategories(userId: string): Promise<void> {
    const defaultCategories = [
      // Income categories
      { name: 'Salary', type: 'INCOME' as const, color: '#4CAF50', icon: 'wallet' },
      { name: 'Freelance', type: 'INCOME' as const, color: '#8BC34A', icon: 'briefcase' },
      { name: 'Investments', type: 'INCOME' as const, color: '#CDDC39', icon: 'trending-up' },
      { name: 'Other Income', type: 'INCOME' as const, color: '#FFC107', icon: 'plus-circle' },

      // Expense categories
      { name: 'Food & Dining', type: 'EXPENSE' as const, color: '#FF5722', icon: 'utensils' },
      { name: 'Transportation', type: 'EXPENSE' as const, color: '#795548', icon: 'car' },
      { name: 'Shopping', type: 'EXPENSE' as const, color: '#E91E63', icon: 'shopping-cart' },
      { name: 'Entertainment', type: 'EXPENSE' as const, color: '#9C27B0', icon: 'music' },
      { name: 'Bills & Utilities', type: 'EXPENSE' as const, color: '#673AB7', icon: 'receipt' },
      { name: 'Healthcare', type: 'EXPENSE' as const, color: '#3F51B5', icon: 'heart' },
      { name: 'Education', type: 'EXPENSE' as const, color: '#2196F3', icon: 'book' },
      { name: 'Home', type: 'EXPENSE' as const, color: '#00BCD4', icon: 'home' },
      { name: 'Personal', type: 'EXPENSE' as const, color: '#009688', icon: 'user' },
      { name: 'Other Expenses', type: 'EXPENSE' as const, color: '#607D8B', icon: 'ellipsis' },

      // Transfer category
      { name: 'Transfer', type: 'TRANSFER' as const, color: '#9E9E9E', icon: 'exchange' },
    ];

    try {
      await this.prisma.category.createMany({
        data: defaultCategories.map((category) => ({
          ...category,
          userId,
          description: `Default ${category.name} category`,
        })),
        skipDuplicates: true,
      });

      this.logger.log(`Created default categories for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to create default categories for user ${userId}`, error);
    }
  }
}