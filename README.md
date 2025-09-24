# 💰 WiseCalK Backend

> A comprehensive financial expense tracking backend built with NestJS, PostgreSQL, Prisma, and Auth0.

## 🚀 Features

- ✅ **Modern Stack**: NestJS with Fastify, PostgreSQL, Prisma ORM
- ✅ **Secure Authentication**: Auth0 integration with JWT validation
- ✅ **Financial-Grade Security**: Encryption, audit trails, RBAC
- ✅ **Multi-Currency Support**: Exchange rates and currency conversion
- ✅ **Clean Architecture**: Domain-Driven Design (DDD) principles
- ✅ **Comprehensive Testing**: Unit, integration, and E2E tests
- ✅ **Production Ready**: Docker, health checks, monitoring
- ✅ **API Documentation**: Swagger/OpenAPI specification

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🔧 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18.0.0 or higher, v22.19.0 recommended)
  - Check `package.json` engines field for exact version requirements
  - Use `nvm use` if you have nvm installed (reads from `.nvmrc`)
- **npm** (v8.0.0 or higher)
- **PostgreSQL** (v15 or higher)
- **Docker** (optional, for containerized development)
- **Auth0 Account** (for authentication)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pserick/wisecalk-backend.git
   cd wisecalk-backend
   ```

2. **Ensure correct Node.js version**:
   ```bash
   # If using nvm (Node Version Manager)
   nvm use

   # Verify Node.js and npm versions
   node --version  # Should be >=18.0.0
   npm --version   # Should be >=8.0.0
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database** (using Docker):
   ```bash
   npm run docker:up
   ```

5. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database** (optional):
   ```bash
   npm run prisma:seed
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

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

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Security Keys (Generate using: openssl rand -hex 32)
JWT_SECRET=your-jwt-secret-key-min-32-chars
ENCRYPTION_KEY=your-encryption-key-64-hex-chars
HASH_SALT=your-hash-salt-32-chars

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### Auth0 Setup

1. **Create an Auth0 Application**:
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Create a new "Single Page Application"
   - Note down Domain, Client ID, and Client Secret

2. **Configure Auth0 Rules/Actions**:
   - Add user roles and permissions to JWT tokens
   - Set up custom claims for `https://api.wisecalk.com/roles`

3. **Setup API in Auth0**:
   - Create a new API with identifier: `https://api.wisecalk.com`
   - Enable RBAC and add permissions

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode with hot reload
npm run start:debug        # Start in debug mode
npm run start:prod         # Start in production mode

# Building
npm run build              # Build the application
npm run format             # Format code with Prettier
npm run lint               # Lint and fix code with ESLint

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:reset       # Reset database and apply migrations
npm run prisma:seed        # Seed database with initial data
npm run prisma:studio      # Open Prisma Studio

# Docker
npm run docker:up          # Start database containers
npm run docker:down        # Stop database containers
npm run docker:build       # Build application Docker image

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:integration   # Run integration tests
npm run test:e2e           # Run end-to-end tests
npm run test:all           # Run all tests
```

### Development Workflow

1. **Start the database**:
   ```bash
   npm run docker:up
   ```

2. **Generate Prisma client**:
   ```bash
   npm run prisma:generate
   ```

3. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

4. **Start development server**:
   ```bash
   npm run start:dev
   ```

5. **Open Prisma Studio** (optional):
   ```bash
   npm run prisma:studio
   ```

The API will be available at `http://localhost:3000/api/v1`

## 🧪 Testing

### Test Structure

```
test/
├── unit/              # Unit tests (70% coverage target)
├── integration/       # Integration tests (20% coverage target)
├── e2e/               # End-to-end tests (10% coverage target)
├── fixtures/          # Test data fixtures
├── mocks/             # Mock implementations
└── utils/             # Test utilities
```

### Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:all
npm run test:cov
```

### Test Database

The test suite uses a separate test database. Make sure to set up:

```bash
# Test environment
DATABASE_URL=postgresql://wisecalk_user:wisecalk_pass@localhost:5432/wisecalk_test
```

## 🚀 Deployment

### Docker Deployment

1. **Build the image**:
   ```bash
   npm run docker:build
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

### Production Environment

1. **Set production environment variables**
2. **Run database migrations**:
   ```bash
   npm run prisma:migrate:prod
   ```
3. **Build the application**:
   ```bash
   npm run build
   ```
4. **Start the application**:
   ```bash
   npm run start:prod
   ```

### Health Checks

The application includes health check endpoints:

- `GET /health` - Basic health check
- `GET /health/db` - Database connectivity check
- `GET /health/detailed` - Detailed system health

## 📚 API Documentation

### Swagger Documentation

Once the application is running, visit:
- **Development**: `http://localhost:3000/api/docs`
- **Production**: `https://your-domain.com/api/docs`

### API Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get user profile

#### Users
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update user profile
- `DELETE /api/v1/users/profile` - Delete user account

#### Accounts
- `GET /api/v1/accounts` - List user accounts
- `POST /api/v1/accounts` - Create new account
- `GET /api/v1/accounts/:id` - Get account details
- `PUT /api/v1/accounts/:id` - Update account
- `DELETE /api/v1/accounts/:id` - Delete account

#### Transactions
- `GET /api/v1/transactions` - List transactions (with filtering)
- `POST /api/v1/transactions` - Create new transaction
- `GET /api/v1/transactions/:id` - Get transaction details
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction
- `GET /api/v1/transactions/summary` - Get transaction analytics

#### Categories
- `GET /api/v1/categories` - List user categories
- `POST /api/v1/categories` - Create new category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

#### Budgets
- `GET /api/v1/budgets` - List budgets
- `POST /api/v1/budgets` - Create new budget
- `PUT /api/v1/budgets/:id` - Update budget
- `DELETE /api/v1/budgets/:id` - Delete budget
- `GET /api/v1/budgets/:id/status` - Get budget vs actual spending

## 📁 Project Structure

```
src/
├── common/                  # Shared utilities and cross-cutting concerns
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Exception filters
│   ├── guards/              # Auth guards
│   ├── interceptors/        # Request/response interceptors
│   ├── pipes/               # Validation pipes
│   ├── types/               # Shared types
│   └── utils/               # Utility functions
├── config/                  # Configuration management
│   ├── auth.config.ts
│   ├── database.config.ts
│   └── app.config.ts
├── infrastructure/          # External concerns (frameworks, databases, APIs)
│   ├── auth/                # Auth0 integration
│   ├── database/            # Prisma setup and migrations
│   ├── events/              # Event publishing/subscribing
│   └── external-apis/       # Third-party API integrations
├── modules/                 # Business modules (bounded contexts)
│   ├── users/               # User management context
│   │   ├── application/     # Use cases and application services
│   │   ├── domain/          # Domain entities, value objects, repositories
│   │   ├── infrastructure/  # Repository implementations, external services
│   │   └── presentation/    # Controllers, DTOs, validators
│   ├── accounts/            # Account management context
│   ├── transactions/        # Transaction management context
│   ├── categories/          # Category management context
│   ├── budgets/             # Budget management context
│   └── analytics/           # Analytics and reporting context
├── shared/                  # Shared domain concepts
│   ├── domain/              # Shared domain entities/value objects
│   └── events/              # Domain events
├── app.module.ts
└── main.ts
```

### Architecture Principles

- **Domain-Driven Design (DDD)**: Business logic organized by domain
- **Clean Architecture**: Dependency inversion and separation of concerns
- **CQRS Pattern**: Command and Query Responsibility Segregation
- **Event-Driven**: Domain events for loose coupling
- **Microservices Ready**: Modular design for easy extraction

## 🔒 Security

### Authentication & Authorization
- Auth0 JWT validation with RS256
- Role-based access control (RBAC)
- Permission-based authorization
- API key management for M2M communication

### Data Protection
- AES-256-GCM encryption for sensitive data
- TLS 1.3 for data in transit
- PII tokenization and hashing
- Secure key management

### Security Headers
- Content Security Policy (CSP)
- HSTS, X-Frame-Options, X-Content-Type-Options
- Rate limiting and DDoS protection
- Input validation and sanitization

## 📊 Monitoring & Observability

### Logging
- Structured logging with correlation IDs
- Different log levels per environment
- Sensitive data exclusion from logs

### Metrics
- Application performance metrics
- Database query performance
- Authentication success/failure rates
- API endpoint response times

### Health Checks
- Liveness and readiness probes
- Database connectivity monitoring
- External service dependency checks

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features and bug fixes
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use semantic commit messages

### Code Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Jest**: Unit and integration testing
- **TypeScript**: Type safety and better developer experience

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help:

1. Check the [documentation](#api-documentation)
2. Look through [existing issues](../../issues)
3. Create a [new issue](../../issues/new) if needed

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://prisma.io/) - Modern database toolkit
- [Auth0](https://auth0.com/) - Identity platform
- [Fastify](https://fastify.io/) - Fast and low overhead web framework

---

**Made with ❤️ for better financial management**