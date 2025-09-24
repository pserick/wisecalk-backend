import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      trustProxy: true,
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('WiseCalK Backend API')
    .setDescription(
      'A comprehensive financial expense tracking API built with NestJS, PostgreSQL, and Prisma ORM. This API provides secure endpoints for managing users, accounts, transactions, categories, budgets, and financial analytics.',
    )
    .setVersion('1.0.0')
    .setContact(
      'WiseCalK Team',
      'https://github.com/wisecalk',
      'support@wisecalk.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API key for machine-to-machine communication',
      },
      'API-Key',
    )
    .addTag('Health', 'Health check endpoints')
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management operations')
    .addTag('Accounts', 'Financial account management')
    .addTag('Transactions', 'Transaction operations and analytics')
    .addTag('Categories', 'Transaction categorization')
    .addTag('Budgets', 'Budget planning and tracking')
    .addTag('Analytics', 'Financial analytics and reporting')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api-staging.wisecalk.com', 'Staging Server')
    .addServer('https://api.wisecalk.com', 'Production Server')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}_${methodKey}`,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1890ff }
    `,
    customSiteTitle: 'WiseCalK API Documentation',
    customfavIcon: '/favicon.ico',
  });

  await app.listen({
    port: parseInt(process.env.PORT ?? '3000'),
    host: '0.0.0.0',
  });

  console.log('🚀 Server is running on http://localhost:3000');
  console.log('📖 API Documentation available at http://localhost:3000/api/docs');
}
bootstrap();
