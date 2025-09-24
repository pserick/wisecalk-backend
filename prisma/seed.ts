import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
  }

  console.log('Created currencies');

  // Seed exchange rates (example rates)
  const usd = await prisma.currency.findUnique({ where: { code: 'USD' } });
  const eur = await prisma.currency.findUnique({ where: { code: 'EUR' } });
  const brl = await prisma.currency.findUnique({ where: { code: 'BRL' } });

  if (usd && eur && brl) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exchangeRates = [
      { fromCurrencyId: usd.id, toCurrencyId: eur.id, rate: 0.92, date: today },
      { fromCurrencyId: eur.id, toCurrencyId: usd.id, rate: 1.09, date: today },
      { fromCurrencyId: usd.id, toCurrencyId: brl.id, rate: 5.05, date: today },
      { fromCurrencyId: brl.id, toCurrencyId: usd.id, rate: 0.20, date: today },
    ];

    for (const rate of exchangeRates) {
      await prisma.exchangeRate.upsert({
        where: {
          fromCurrencyId_toCurrencyId_date: {
            fromCurrencyId: rate.fromCurrencyId,
            toCurrencyId: rate.toCurrencyId,
            date: rate.date,
          },
        },
        update: { rate: rate.rate },
        create: rate,
      });
    }

    console.log('Created exchange rates');
  }

  // Create demo user (for development only)
  if (process.env.NODE_ENV === 'development') {
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@wisecalk.com' },
      update: {},
      create: {
        auth0Id: 'auth0|demo123',
        email: 'demo@wisecalk.com',
        firstName: 'Demo',
        lastName: 'User',
        timezone: 'America/New_York',
        locale: 'en-US',
      },
    });

    console.log('Created demo user:', demoUser.email);

    // Create default categories for demo user
    const incomeCategories = [
      { name: 'Salary', type: 'INCOME' as const, color: '#4CAF50', icon: 'wallet' },
      { name: 'Freelance', type: 'INCOME' as const, color: '#8BC34A', icon: 'briefcase' },
      { name: 'Investments', type: 'INCOME' as const, color: '#CDDC39', icon: 'trending-up' },
      { name: 'Other Income', type: 'INCOME' as const, color: '#FFC107', icon: 'plus-circle' },
    ];

    const expenseCategories = [
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
    ];

    for (const category of [...incomeCategories, ...expenseCategories]) {
      await prisma.category.create({
        data: {
          ...category,
          userId: demoUser.id,
          description: `Default ${category.name} category`,
        },
      });
    }

    console.log('Created default categories for demo user');

    // Create demo accounts
    if (usd && brl) {
      await prisma.account.create({
        data: {
          name: 'Main Checking',
          type: 'CHECKING',
          balance: 5000,
          currencyId: usd.id,
          userId: demoUser.id,
          description: 'Primary checking account',
        },
      });

      await prisma.account.create({
        data: {
          name: 'Savings Account',
          type: 'SAVINGS',
          balance: 10000,
          currencyId: usd.id,
          userId: demoUser.id,
          description: 'Emergency fund and savings',
        },
      });

      await prisma.account.create({
        data: {
          name: 'Brazilian Account',
          type: 'CHECKING',
          balance: 5000,
          currencyId: brl.id,
          userId: demoUser.id,
          description: 'Brazilian bank account',
        },
      });

      console.log('Created demo accounts');
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });