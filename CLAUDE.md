# 🤖 WiseCalK Backend - Claude Technical Documentation

> **Complete technical reference for AI-assisted development of the WiseCalK financial expense tracking backend**

This document serves as a comprehensive technical guide for continuing development on the WiseCalK backend project. It contains all architectural decisions, implementation patterns, and operational knowledge required for effective AI-assisted development.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture & Design Patterns](#-architecture--design-patterns)
- [Technology Stack](#-technology-stack)
- [Development Environment](#-development-environment)
- [Database Architecture](#-database-architecture)
- [Authentication & Security](#-authentication--security)
- [API Design & Documentation](#-api-design--documentation)
- [Testing Strategy](#-testing-strategy)
- [Deployment & Operations](#-deployment--operations)
- [Code Patterns & Guidelines](#-code-patterns--guidelines)
- [Common Tasks & Workflows](#-common-tasks--workflows)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

### Core Purpose
WiseCalK is a **financial-grade expense tracking backend** designed for secure, multi-currency personal finance management with comprehensive reporting and budgeting capabilities.

### Key Characteristics
- **Financial-Grade Security**: Bank-level security with encryption, audit trails, and RBAC
- **Multi-Currency Support**: Global financial operations with real-time exchange rates
- **Domain-Driven Design**: Clean architecture with clear business boundaries
- **Production-Ready**: Comprehensive monitoring, health checks, and containerization
- **API-First**: Complete OpenAPI/Swagger documentation with interactive testing

### Business Domains
1. **User Management**: Authentication, profiles, preferences
2. **Account Management**: Financial accounts (checking, savings, credit cards, etc.)
3. **Transaction Management**: Income, expenses, transfers with categorization
4. **Budget Planning**: Period-based budgets with alerts and tracking
5. **Goal Setting**: Financial objectives with progress tracking
6. **Analytics & Reporting**: Insights, trends, and financial summaries

---

## 🏗️ Architecture & Design Patterns

### Clean Architecture Implementation

```
┌─────────────────┐
│   Presentation  │ ← Controllers, DTOs, Validators
├─────────────────┤
│   Application   │ ← Use Cases, Application Services
├─────────────────┤
│     Domain      │ ← Entities, Value Objects, Repositories
├─────────────────┤
│ Infrastructure  │ ← Database, Auth, External APIs
└─────────────────┘
```

### DDD Bounded Contexts

```
src/modules/
├── users/           # Identity & Access Management
├── accounts/        # Financial Account Management
├── transactions/    # Transaction Processing
├── categories/      # Transaction Categorization
├── budgets/         # Budget Planning & Tracking
├── goals/           # Financial Goal Management
└── analytics/       # Reporting & Analytics
```

### Design Patterns Used
- **Repository Pattern**: Data access abstraction
- **CQRS**: Command Query Responsibility Segregation
- **Domain Events**: Loose coupling between bounded contexts
- **Strategy Pattern**: Multiple authentication strategies
- **Decorator Pattern**: Extensive use for metadata and validation
- **Factory Pattern**: Complex entity creation
- **Observer Pattern**: Event-driven architecture

---

## 🛠️ Technology Stack

### Core Framework
- **NestJS 11.x**: Progressive Node.js framework with decorators and DI
- **Fastify**: High-performance web server (chosen over Express for speed)
- **TypeScript 5.x**: Strong typing with strict configuration
- **Prisma ORM**: Type-safe database client with schema management

### Database & Storage
- **PostgreSQL 15**: Primary database with advanced features
- **Redis 7**: Caching and session storage
- **Prisma**: Schema-first ORM with migration management

### Authentication & Security
- **Auth0**: Identity platform with JWT validation
- **Passport.js**: Authentication middleware
- **JWT Strategy**: RS256 algorithm for token validation
- **RBAC**: Role-Based Access Control implementation

### Development & Testing
- **Jest**: Unit and integration testing
- **Supertest**: E2E API testing
- **ESLint + Prettier**: Code quality and formatting
- **Husky**: Git hooks for quality gates

### DevOps & Deployment
- **Docker**: Containerization for development and production
- **Docker Compose**: Multi-service development environment
- **Swagger/OpenAPI**: API documentation and testing

---

## 🔧 Development Environment

### Project Structure

```
wisecalk-backend/
├── src/
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── dtos/           # Shared DTOs
│   │   ├── filters/        # Exception filters
│   │   └── utils/          # Utility functions
│   ├── config/             # Configuration management
│   ├── infrastructure/     # External concerns
│   │   ├── auth/           # Auth0 integration
│   │   └── database/       # Prisma setup
│   ├── modules/            # Business modules
│   ├── app.module.ts       # Root module
│   └── main.ts            # Application bootstrap
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts            # Database seeding
├── test/                   # Test suites
├── docker-compose.yml      # Development services
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

### Essential Scripts

```bash
# Development
npm run start:dev          # Hot reload development server
npm run start:debug        # Debug mode with inspector

# Database Operations
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed development data
npm run prisma:studio      # Open database GUI
npm run prisma:reset       # Reset database completely

# Docker Services
npm run docker:up          # Start PostgreSQL and Redis
npm run docker:down        # Stop all services

# Testing
npm run test               # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests
npm run test:all          # All test suites

# Code Quality
npm run lint              # ESLint with auto-fix
npm run format            # Prettier formatting
npm run build             # TypeScript compilation
```

### Environment Configuration

**Required Environment Variables:**

```bash
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://wisecalk_user:wisecalk_pass@localhost:5432/wisecalk_dev

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://api.wisecalk.com

# Security
JWT_SECRET=your-jwt-secret-key-min-32-chars
ENCRYPTION_KEY=your-encryption-key-64-hex-chars

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=wisecalk_redis_pass
```

### TypeScript Configuration

**Key tsconfig.json settings:**

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "paths": {
      "@/*": ["src/*"],
      "@modules/*": ["src/modules/*"],
      "@common/*": ["src/common/*"],
      "@infrastructure/*": ["src/infrastructure/*"]
    }
  }
}
```

---

## 🗄️ Database Architecture

### Schema Overview

The database follows **financial industry standards** with comprehensive audit trails, soft deletes, and precise monetary calculations.

### Core Models

#### 1. User Model
```typescript
model User {
  id        String   @id @default(cuid())
  auth0Id   String   @unique @map("auth0_id")
  email     String   @unique
  firstName String?  @map("first_name")
  lastName  String?  @map("last_name")
  timezone  String   @default("UTC")
  locale    String   @default("en-US")

  // Audit fields
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // Soft delete

  // Relations
  accounts     Account[]
  categories   Category[]
  transactions Transaction[]
  budgets      Budget[]
  goals        Goal[]
}
```

#### 2. Currency Model
```typescript
model Currency {
  id     String @id @default(cuid())
  code   String @unique // ISO 4217 (USD, EUR, BRL)
  name   String
  symbol String

  // Relations to all monetary entities
  accounts          Account[]
  transactions      Transaction[]
  exchangeRatesFrom ExchangeRate[] @relation("FromCurrency")
  exchangeRatesTo   ExchangeRate[] @relation("ToCurrency")
  budgets           Budget[]
  goals             Goal[]
}
```

#### 3. Account Model
```typescript
model Account {
  id          String      @id @default(cuid())
  name        String
  type        AccountType // CHECKING, SAVINGS, CREDIT_CARD, etc.
  balance     Decimal     @db.Decimal(15, 2) // High precision
  currency    Currency    @relation(fields: [currencyId], references: [id])
  user        User        @relation(fields: [userId], references: [id])
  isActive    Boolean     @default(true)

  transactions Transaction[]
}

enum AccountType {
  CHECKING
  SAVINGS
  CREDIT_CARD
  INVESTMENT
  CASH
  CRYPTO
  LOAN
  OTHER
}
```

#### 4. Transaction Model
```typescript
model Transaction {
  id            String          @id @default(cuid())
  amount        Decimal         @db.Decimal(15, 2)
  description   String
  type          TransactionType // INCOME, EXPENSE, TRANSFER
  date          DateTime        @db.Date

  // Relations
  account       Account    @relation(fields: [accountId], references: [id])
  category      Category   @relation(fields: [categoryId], references: [id])
  currency      Currency   @relation(fields: [currencyId], references: [id])
  user          User       @relation(fields: [userId], references: [id])

  // Transfer handling (self-referential)
  transferTo    Transaction? @relation("TransferPair", fields: [transferToId], references: [id])
  transferFrom  Transaction? @relation("TransferPair")

  // Additional features
  receiptUrl    String?    // File attachment support
  isReconciled  Boolean    @default(false)
  reconciledAt  DateTime?
}
```

#### 5. Category Model (Hierarchical)
```typescript
model Category {
  id          String       @id @default(cuid())
  name        String
  type        CategoryType // INCOME, EXPENSE, TRANSFER
  color       String?      // UI theming
  icon        String?      // Icon identifier

  // Hierarchical structure
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")

  user        User       @relation(fields: [userId], references: [id])
  transactions Transaction[]
  budgets     Budget[]
}
```

### Indexing Strategy

**Performance-optimized indexes:**

```sql
-- User lookups
@@index([email])
@@index([auth0Id])

-- Transaction queries (most frequent)
@@index([userId, date])
@@index([accountId, date])
@@index([categoryId, date])
@@index([userId, type, date])
@@index([userId, accountId, date])

-- Budget and reporting
@@index([userId, isActive])
@@index([categoryId, startDate, endDate])

-- Soft delete support
@@index([deletedAt])
```

### Audit Trail Implementation

**Every model includes:**
- `createdAt`: Record creation timestamp
- `updatedAt`: Last modification timestamp
- `deletedAt`: Soft delete timestamp (NULL = active)

### Currency & Exchange Rate Handling

```typescript
model ExchangeRate {
  fromCurrency   Currency @relation("FromCurrency")
  toCurrency     Currency @relation("ToCurrency")
  rate           Decimal  @db.Decimal(18, 8) // High precision rates
  date           DateTime @db.Date

  @@unique([fromCurrencyId, toCurrencyId, date])
}
```

---

## 🔐 Authentication & Security

### Auth0 Integration Architecture

```
┌─────────────┐    JWT Token    ┌─────────────┐    Validation    ┌─────────────┐
│   Frontend  │ ──────────────> │   Backend   │ ──────────────> │    Auth0    │
│             │                 │             │                 │             │
└─────────────┘                 └─────────────┘                 └─────────────┘
                                       │
                                       v
                                ┌─────────────┐
                                │  Database   │
                                │ (User Sync) │
                                └─────────────┘
```

### JWT Strategy Implementation

**Location**: `src/infrastructure/auth/strategies/jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any): Promise<AuthUser> {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload['https://api.wisecalk.com/roles'] || [],
      permissions: payload['https://api.wisecalk.com/permissions'] || [],
    };
  }
}
```

### Security Decorators

#### 1. Public Endpoint Decorator
```typescript
// Usage: @Public() - Bypasses authentication
export const Public = () => SetMetadata('isPublic', true);
```

#### 2. Roles Decorator
```typescript
// Usage: @Roles('admin', 'manager')
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

#### 3. Permissions Decorator
```typescript
// Usage: @Permissions('read:transactions', 'write:budgets')
export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
```

#### 4. Current User Decorator
```typescript
// Usage: @CurrentUser() user: AuthUser
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### Guards Implementation

#### 1. JWT Auth Guard
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```

#### 2. Roles Guard
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

### User Synchronization

**Location**: `src/infrastructure/auth/services/user-sync.service.ts`

Automatically syncs Auth0 users with local database on first login:

```typescript
@Injectable()
export class UserSyncService {
  async syncUser(auth0User: AuthUser): Promise<User> {
    return this.prisma.user.upsert({
      where: { auth0Id: auth0User.id },
      update: {
        email: auth0User.email,
        firstName: auth0User.given_name,
        lastName: auth0User.family_name,
      },
      create: {
        auth0Id: auth0User.id,
        email: auth0User.email,
        firstName: auth0User.given_name,
        lastName: auth0User.family_name,
      },
    });
  }
}
```

### Security Best Practices Implemented

1. **JWT Validation**: RS256 algorithm with JWKS endpoint
2. **RBAC**: Role and permission-based access control
3. **Input Validation**: Class-validator with whitelisting
4. **CORS**: Configurable origins with credentials support
5. **Rate Limiting**: Configurable request throttling
6. **Helmet**: Security headers middleware
7. **Audit Logging**: All user actions tracked
8. **Soft Deletes**: Data preservation for audit compliance

---

## 📡 API Design & Documentation

### Swagger Configuration

**Location**: `src/main.ts`

```typescript
const config = new DocumentBuilder()
  .setTitle('WiseCalK Backend API')
  .setDescription('A comprehensive financial expense tracking API...')
  .setVersion('1.0.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header',
  }, 'JWT-auth')
  .addApiKey({
    type: 'apiKey',
    name: 'X-API-Key',
    in: 'header',
    description: 'API key for machine-to-machine communication',
  }, 'API-Key')
  .addTag('Health', 'Health check endpoints')
  .addTag('Authentication', 'User authentication and authorization')
  .addTag('Users', 'User management operations')
  .addTag('Accounts', 'Financial account management')
  .addTag('Transactions', 'Transaction operations and analytics')
  .addTag('Categories', 'Transaction categorization')
  .addTag('Budgets', 'Budget planning and tracking')
  .addTag('Analytics', 'Financial analytics and reporting')
  .build();
```

### Health Check Endpoints

#### Basic Health Check
```http
GET /health
```

**Response**: `src/common/dtos/health-response.dto.ts`
```typescript
export class HealthResponseDto {
  @ApiProperty({ enum: ['ok', 'error'] })
  status: string;

  @ApiProperty({ example: '2023-09-23T20:53:38.481Z' })
  timestamp: string;

  @ApiProperty({ example: 35.613228083 })
  uptime: number;

  @ApiProperty({ enum: ['development', 'staging', 'production'] })
  environment: string;

  @ApiProperty({ example: '1.0.0' })
  version: string;

  @ApiProperty({ example: 'WiseCalK Backend is healthy!' })
  message: string;
}
```

#### Database Health Check
```http
GET /health/db
```

**Response**:
```typescript
export class DatabaseHealthResponseDto {
  @ApiProperty({ enum: ['ok', 'error'] })
  status: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty({ type: DatabaseHealthDto })
  database: DatabaseHealthDto;

  @ApiProperty()
  message: string;
}

export class DatabaseHealthDto {
  @ApiProperty({ example: true })
  connected: boolean;

  @ApiProperty({ example: 1, required: false })
  users?: number;

  @ApiProperty({ example: 8, required: false })
  currencies?: number;

  @ApiProperty({ required: false })
  error?: string;
}
```

### API Versioning Strategy

- **Global Prefix**: `/api/v1`
- **Version in URL**: Clear versioning strategy
- **Backward Compatibility**: Maintain previous versions during transitions

### DTO Patterns

**Input Validation**:
```typescript
export class CreateTransactionDto {
  @ApiProperty({ example: 29.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'Coffee at Starbucks' })
  @IsString()
  @Length(1, 255)
  description: string;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: '2023-09-23' })
  @IsDateString()
  date: string;
}
```

**Response Transformation**:
```typescript
export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty()
  date: string;

  @ApiProperty()
  account: AccountSummaryDto;

  @ApiProperty()
  category: CategorySummaryDto;
}
```

### Error Response Format

```typescript
{
  "statusCode": 400,
  "message": ["amount must be a positive number"],
  "error": "Bad Request",
  "timestamp": "2023-09-23T20:53:38.481Z",
  "path": "/api/v1/transactions"
}
```

---

## 🧪 Testing Strategy

### Test Pyramid Structure

```
         /\
        /  \
       / E2E \ (10% - Integration tests with real database)
      /______\
     /        \
    / Integration \ (20% - Module integration tests)
   /______________\
  /                \
 /   Unit Tests     \ (70% - Isolated component tests)
/__________________\
```

### Test Configuration

**Jest Configuration** (`package.json`):
```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### Unit Test Patterns

**Service Testing**:
```typescript
describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a transaction', async () => {
    const mockTransaction = { id: '1', amount: 100 };
    jest.spyOn(prisma.transaction, 'create').mockResolvedValue(mockTransaction);

    const result = await service.create(createTransactionDto);
    expect(result).toEqual(mockTransaction);
  });
});
```

### Integration Test Patterns

**Controller Testing**:
```typescript
describe('TransactionController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  it('/transactions (POST)', () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send(createTransactionDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.amount).toEqual(createTransactionDto.amount);
      });
  });
});
```

### E2E Test Configuration

**E2E Configuration** (`test/jest-e2e.json`):
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" }
}
```

### Test Database Management

**Test Environment Setup**:
```bash
# Separate test database
DATABASE_URL=postgresql://wisecalk_user:wisecalk_pass@localhost:5432/wisecalk_test

# Test-specific configuration
NODE_ENV=test
LOG_LEVEL=error
```

### Coverage Targets

- **Unit Tests**: 80% coverage minimum
- **Integration Tests**: Critical user flows covered
- **E2E Tests**: Happy path and error scenarios

### Test Scripts Usage

```bash
# Development testing
npm run test:watch          # Continuous testing during development
npm run test:cov           # Generate coverage reports

# CI/CD testing
npm run test:all           # Complete test suite
npm run test:integration   # Module integration tests
npm run test:e2e          # End-to-end API tests
```

---

## 🚀 Deployment & Operations

### Docker Development Environment

**docker-compose.yml Configuration**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: wisecalk-postgres
    environment:
      POSTGRES_USER: wisecalk_user
      POSTGRES_PASSWORD: wisecalk_pass
      POSTGRES_DB: wisecalk_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U wisecalk_user -d wisecalk_dev']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: wisecalk-redis
    ports:
      - '6379:6379'
    command: redis-server --appendonly yes --requirepass wisecalk_redis_pass
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', '--auth', 'wisecalk_redis_pass', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

### Production Deployment Checklist

#### 1. Environment Preparation
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URL
- [ ] Set strong JWT secrets and encryption keys
- [ ] Configure Auth0 production tenant
- [ ] Set CORS origins for production domains
- [ ] Configure Redis for session storage

#### 2. Database Migration
```bash
# Production migration (non-destructive)
npm run prisma:migrate:prod

# Verify migration success
npm run prisma:studio
```

#### 3. Application Build
```bash
# Clean build for production
npm run build

# Verify build artifacts
ls -la dist/
```

#### 4. Production Start
```bash
# Start production server
npm run start:prod

# Or with PM2 for process management
pm2 start dist/main.js --name wisecalk-backend
```

### Health Monitoring

#### Application Health Checks

**Kubernetes Liveness Probe**:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
```

**Kubernetes Readiness Probe**:
```yaml
readinessProbe:
  httpGet:
    path: /health/db
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

#### Monitoring Endpoints

1. **Basic Health**: `GET /health`
   - Server uptime and basic status
   - Environment information
   - API version

2. **Database Health**: `GET /health/db`
   - Database connectivity
   - Connection pool status
   - Basic record counts

### Performance Considerations

#### Database Optimization
- **Connection Pooling**: Prisma manages connection pool automatically
- **Query Optimization**: Strategic indexing for common queries
- **Read Replicas**: Consider for high-read workloads
- **Caching**: Redis for frequently accessed data

#### Application Performance
- **Fastify**: Chosen for superior performance over Express
- **Validation**: Efficient class-validator implementation
- **Serialization**: Optimized DTO transformations
- **Async Processing**: Event-driven architecture for heavy operations

### Security Hardening

#### Production Security Configuration
```typescript
// Helmet configuration for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
```

#### SSL/TLS Configuration
- **Minimum TLS 1.3**: Modern encryption standards
- **HSTS Headers**: Enforce HTTPS connections
- **Certificate Management**: Automated renewal with Let's Encrypt

---

## 💻 Code Patterns & Guidelines

### Naming Conventions

#### 1. Files and Directories
```
kebab-case.extension
user-profile.service.ts
transaction-history.controller.ts
account-balance.dto.ts
```

#### 2. Classes and Interfaces
```typescript
// PascalCase for classes
export class TransactionService { }
export class CreateUserDto { }

// PascalCase with 'I' prefix for interfaces
export interface ITransactionRepository { }
export interface IEmailService { }
```

#### 3. Variables and Functions
```typescript
// camelCase for variables and functions
const userId = 'user-123';
const calculateBalance = (transactions: Transaction[]) => { };

// SCREAMING_SNAKE_CASE for constants
const MAX_TRANSACTION_AMOUNT = 1000000;
const DEFAULT_CURRENCY_CODE = 'USD';
```

### Error Handling Patterns

#### 1. Custom Exception Classes
```typescript
export class InsufficientFundsException extends BadRequestException {
  constructor(accountId: string, requestedAmount: number, availableBalance: number) {
    super({
      message: 'Insufficient funds for transaction',
      details: {
        accountId,
        requestedAmount,
        availableBalance,
        shortfall: requestedAmount - availableBalance,
      },
    });
  }
}
```

#### 2. Global Exception Filter
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error',
    };

    response.status(status).json(errorResponse);
  }
}
```

### Validation Patterns

#### 1. DTO Validation
```typescript
export class CreateTransactionDto {
  @ApiProperty({ example: 29.99, minimum: 0.01 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Max(1000000, { message: 'Amount cannot exceed $1,000,000' })
  amount: number;

  @ApiProperty({ example: 'Coffee purchase' })
  @IsString()
  @Length(1, 255, { message: 'Description must be 1-255 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_.,!]+$/, {
    message: 'Description contains invalid characters'
  })
  description: string;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType, {
    message: 'Type must be INCOME, EXPENSE, or TRANSFER'
  })
  type: TransactionType;

  @ApiProperty({ example: '2023-09-23' })
  @IsDateString({}, { message: 'Date must be in ISO format YYYY-MM-DD' })
  date: string;
}
```

#### 2. Custom Validators
```typescript
@ValidatorConstraint({ name: 'IsCurrency', async: false })
export class IsCurrencyConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return typeof value === 'string' && /^[A-Z]{3}$/.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Currency code must be 3 uppercase letters (e.g., USD, EUR)';
  }
}

export function IsCurrency(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCurrencyConstraint,
    });
  };
}
```

### Service Layer Patterns

#### 1. Repository Pattern Implementation
```typescript
export abstract class ITransactionRepository {
  abstract create(data: CreateTransactionData): Promise<Transaction>;
  abstract findById(id: string): Promise<Transaction | null>;
  abstract findByUserId(userId: string, filters: TransactionFilters): Promise<Transaction[]>;
  abstract update(id: string, data: UpdateTransactionData): Promise<Transaction>;
  abstract delete(id: string): Promise<void>;
}

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTransactionData): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
      include: {
        account: true,
        category: true,
        currency: true,
      },
    });
  }

  // Implementation continues...
}
```

#### 2. Service Layer with Business Logic
```typescript
@Injectable()
export class TransactionService {
  constructor(
    @Inject('ITransactionRepository')
    private transactionRepository: ITransactionRepository,
    private accountService: AccountService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createTransaction(
    userId: string,
    dto: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    // Business validation
    await this.validateTransactionLimits(dto.amount, dto.type);

    // Account balance validation
    if (dto.type === TransactionType.EXPENSE) {
      await this.accountService.validateSufficientFunds(dto.accountId, dto.amount);
    }

    // Create transaction
    const transaction = await this.transactionRepository.create({
      ...dto,
      userId,
    });

    // Update account balance
    await this.accountService.updateBalance(
      dto.accountId,
      dto.amount,
      dto.type
    );

    // Emit domain event
    this.eventEmitter.emit('transaction.created', {
      transactionId: transaction.id,
      userId,
      amount: dto.amount,
      type: dto.type,
    });

    return this.toResponseDto(transaction);
  }

  private async validateTransactionLimits(amount: number, type: TransactionType): Promise<void> {
    const limits = await this.getUserTransactionLimits();

    if (amount > limits.maxSingleTransaction) {
      throw new TransactionLimitExceededException(amount, limits.maxSingleTransaction);
    }
  }
}
```

### Module Organization Pattern

#### 1. Module Structure
```typescript
@Module({
  imports: [
    PrismaModule,
    EventEmitterModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: 'ITransactionRepository',
      useClass: PrismaTransactionRepository,
    },
    TransactionValidationService,
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
```

#### 2. Feature Module Template
```
src/modules/[feature]/
├── application/
│   ├── services/           # Business logic services
│   ├── use-cases/         # Command/query handlers
│   └── events/            # Domain event handlers
├── domain/
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces
│   └── value-objects/     # Value objects
├── infrastructure/
│   ├── repositories/      # Repository implementations
│   └── external/          # External service integrations
├── presentation/
│   ├── controllers/       # REST controllers
│   ├── dtos/             # Data transfer objects
│   └── validators/        # Custom validators
└── [feature].module.ts    # Feature module definition
```

---

## ⚡ Common Tasks & Workflows

### Database Operations

#### 1. Creating New Migrations
```bash
# Generate migration after schema changes
npm run prisma:migrate

# Name the migration descriptively
npx prisma migrate dev --name add_transaction_tags

# Reset database completely (development only)
npm run prisma:reset
```

#### 2. Seeding Development Data
```typescript
// prisma/seed.ts
async function main() {
  // Create default currencies
  const usd = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
    },
  });

  // Create test user
  const user = await prisma.user.create({
    data: {
      auth0Id: 'auth0|test-user-id',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  });

  // Create sample account
  await prisma.account.create({
    data: {
      name: 'Main Checking',
      type: 'CHECKING',
      balance: 1000.00,
      currencyId: usd.id,
      userId: user.id,
    },
  });
}
```

#### 3. Database Inspection
```bash
# Open Prisma Studio for visual database management
npm run prisma:studio

# Check current migration status
npx prisma migrate status

# View generated client
npx prisma generate
```

### Adding New API Endpoints

#### 1. Create DTO Classes
```typescript
// src/modules/transactions/presentation/dtos/create-transaction.dto.ts
export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  description: string;

  // Additional validation...
}

// Response DTO
export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;
}
```

#### 2. Implement Service Logic
```typescript
// src/modules/transactions/application/services/transaction.service.ts
@Injectable()
export class TransactionService {
  async createTransaction(
    userId: string,
    dto: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    // Business logic implementation
    const transaction = await this.prisma.transaction.create({
      data: {
        ...dto,
        userId,
      },
    });

    return this.mapToResponseDto(transaction);
  }
}
```

#### 3. Create Controller
```typescript
// src/modules/transactions/presentation/controllers/transaction.controller.ts
@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create new transaction' })
  @ApiResponse({ status: 201, type: TransactionResponseDto })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.createTransaction(user.id, dto);
  }
}
```

#### 4. Update Module Configuration
```typescript
// src/modules/transactions/transaction.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
```

### Testing New Features

#### 1. Write Unit Tests
```typescript
// transaction.service.spec.ts
describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create transaction successfully', async () => {
    // Test implementation
  });
});
```

#### 2. Integration Tests
```typescript
// transaction.controller.integration.spec.ts
describe('TransactionController (Integration)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/transactions (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${validJwtToken}`)
      .send(createTransactionDto)
      .expect(201);
  });
});
```

### Performance Optimization

#### 1. Database Query Optimization
```typescript
// Efficient query with proper includes
const transactions = await this.prisma.transaction.findMany({
  where: { userId },
  include: {
    account: { select: { id: true, name: true } },
    category: { select: { id: true, name: true, color: true } },
    currency: { select: { code: true, symbol: true } },
  },
  orderBy: { date: 'desc' },
  take: 50, // Pagination
  skip: offset,
});

// Use select instead of include when possible
const transactionSummary = await this.prisma.transaction.findMany({
  select: {
    id: true,
    amount: true,
    date: true,
    description: true,
  },
  where: { userId },
});
```

#### 2. Caching Strategies
```typescript
@Injectable()
export class CachedTransactionService {
  constructor(
    private transactionService: TransactionService,
    private cacheManager: Cache,
  ) {}

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const cacheKey = `user:${userId}:transactions`;

    let transactions = await this.cacheManager.get<Transaction[]>(cacheKey);

    if (!transactions) {
      transactions = await this.transactionService.findByUserId(userId);
      await this.cacheManager.set(cacheKey, transactions, 300); // 5 minutes
    }

    return transactions;
  }
}
```

---

## 🔍 Troubleshooting

### Common Development Issues

#### 1. Database Connection Issues

**Problem**: `Can't reach database server`

**Solutions**:
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Start database containers
npm run docker:up

# Check database logs
docker logs wisecalk-postgres

# Test connection manually
psql postgresql://wisecalk_user:wisecalk_pass@localhost:5432/wisecalk_dev
```

#### 2. Prisma Client Issues

**Problem**: `Unknown argument 'include'` or outdated client

**Solutions**:
```bash
# Regenerate Prisma client after schema changes
npm run prisma:generate

# Reset database if schema is incompatible
npm run prisma:reset

# Check for pending migrations
npx prisma migrate status
```

#### 3. Auth0 JWT Validation Errors

**Problem**: `Invalid token` or `Unable to verify JWT`

**Solutions**:
```bash
# Verify Auth0 configuration
echo $AUTH0_DOMAIN
echo $AUTH0_AUDIENCE

# Check JWKS endpoint accessibility
curl https://$AUTH0_DOMAIN/.well-known/jwks.json

# Validate JWT token format
# Token should be: header.payload.signature
```

#### 4. TypeScript Compilation Errors

**Problem**: `Cannot find module` or `Type errors`

**Solutions**:
```bash
# Clean build artifacts
rm -rf dist/

# Reinstall dependencies
rm -rf node_modules/
npm install

# Check TypeScript configuration
npx tsc --noEmit

# Fix path mapping issues
npm run build
```

### Performance Issues

#### 1. Slow Database Queries

**Diagnosis**:
```typescript
// Enable Prisma query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Add query timing
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});
```

**Solutions**:
- Add database indexes for frequently queried fields
- Use `select` instead of `include` when possible
- Implement pagination for large result sets
- Consider query result caching

#### 2. Memory Leaks

**Diagnosis**:
```bash
# Monitor memory usage
npm install -g clinic
clinic doctor -- npm run start:prod

# Check for event listener leaks
node --trace-warnings server.js
```

**Solutions**:
- Remove event listeners properly
- Close database connections
- Implement proper cleanup in service destroy methods

### Security Issues

#### 1. CORS Errors

**Problem**: Browser blocks API requests

**Solutions**:
```typescript
// Update CORS configuration in main.ts
app.enableCors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

#### 2. Authentication Bypass

**Problem**: Protected endpoints accessible without auth

**Solutions**:
```typescript
// Ensure global auth guard is applied
app.useGlobalGuards(new JwtAuthGuard(reflector));

// Verify @Public() decorator usage
@Get('public-endpoint')
@Public()
async getPublicData() {
  // Only use @Public() for truly public endpoints
}
```

### Deployment Issues

#### 1. Environment Variable Problems

**Problem**: App fails to start in production

**Solutions**:
```bash
# Verify all required environment variables
printenv | grep -E "(DATABASE_URL|AUTH0|JWT_SECRET)"

# Check .env file is not committed to git
git ls-files | grep .env

# Use environment-specific configurations
NODE_ENV=production npm run start:prod
```

#### 2. Database Migration Failures

**Problem**: Migration fails in production

**Solutions**:
```bash
# Run migrations separately before app start
npm run prisma:migrate:prod

# Check migration history
npx prisma migrate status

# Rollback if necessary (careful in production)
npx prisma migrate reset --force
```

---

## 📚 Additional Resources

### Documentation Links
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Auth0 Node.js Quickstart](https://auth0.com/docs/quickstart/backend/nodejs)
- [Fastify Documentation](https://www.fastify.io/docs/)

### Development Tools
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [Auth0 Dashboard](https://manage.auth0.com/) - Identity management
- [Swagger UI](http://localhost:3000/api/docs) - API documentation
- [PostgreSQL Admin](https://www.pgadmin.org/) - Database administration

### Code Quality Tools
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*This documentation is maintained as part of the WiseCalK backend project. Keep it updated as the codebase evolves.*

**Last Updated**: September 2024
**Version**: 1.0.0
**Maintainer**: WiseCalK Development Team