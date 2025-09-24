-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'CASH', 'CRYPTO', 'LOAN', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "public"."BudgetPeriod" AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."GoalType" AS ENUM ('SAVINGS', 'DEBT_PAYOFF', 'INVESTMENT', 'EMERGENCY_FUND', 'OTHER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "auth0_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "locale" TEXT NOT NULL DEFAULT 'en-US',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."currencies" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."exchange_rates" (
    "id" TEXT NOT NULL,
    "from_currency_id" TEXT NOT NULL,
    "to_currency_id" TEXT NOT NULL,
    "rate" DECIMAL(18,8) NOT NULL,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."AccountType" NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "currency_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "type" "public"."CategoryType" NOT NULL,
    "user_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "type" "public"."TransactionType" NOT NULL,
    "date" DATE NOT NULL,
    "account_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "currency_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transfer_to_id" TEXT,
    "receipt_url" TEXT,
    "is_reconciled" BOOLEAN NOT NULL DEFAULT false,
    "reconciled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."budgets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "period" "public"."BudgetPeriod" NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    "currency_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "alert_threshold" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."goals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "target_amount" DECIMAL(15,2) NOT NULL,
    "current_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "target_date" DATE,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "currency_id" TEXT NOT NULL,
    "type" "public"."GoalType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0_id_key" ON "public"."users"("auth0_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "public"."users"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "public"."currencies"("code");

-- CreateIndex
CREATE INDEX "currencies_code_idx" ON "public"."currencies"("code");

-- CreateIndex
CREATE INDEX "currencies_deleted_at_idx" ON "public"."currencies"("deleted_at");

-- CreateIndex
CREATE INDEX "exchange_rates_from_currency_id_to_currency_id_date_idx" ON "public"."exchange_rates"("from_currency_id", "to_currency_id", "date");

-- CreateIndex
CREATE INDEX "exchange_rates_date_idx" ON "public"."exchange_rates"("date");

-- CreateIndex
CREATE INDEX "exchange_rates_deleted_at_idx" ON "public"."exchange_rates"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "exchange_rates_from_currency_id_to_currency_id_date_key" ON "public"."exchange_rates"("from_currency_id", "to_currency_id", "date");

-- CreateIndex
CREATE INDEX "accounts_user_id_is_active_idx" ON "public"."accounts"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "accounts_type_idx" ON "public"."accounts"("type");

-- CreateIndex
CREATE INDEX "accounts_currency_id_idx" ON "public"."accounts"("currency_id");

-- CreateIndex
CREATE INDEX "accounts_deleted_at_idx" ON "public"."accounts"("deleted_at");

-- CreateIndex
CREATE INDEX "accounts_user_id_type_is_active_idx" ON "public"."accounts"("user_id", "type", "is_active");

-- CreateIndex
CREATE INDEX "categories_user_id_type_is_active_idx" ON "public"."categories"("user_id", "type", "is_active");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "public"."categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_type_idx" ON "public"."categories"("type");

-- CreateIndex
CREATE INDEX "categories_deleted_at_idx" ON "public"."categories"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "categories_user_id_name_parent_id_key" ON "public"."categories"("user_id", "name", "parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transfer_to_id_key" ON "public"."transactions"("transfer_to_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_date_idx" ON "public"."transactions"("user_id", "date");

-- CreateIndex
CREATE INDEX "transactions_account_id_date_idx" ON "public"."transactions"("account_id", "date");

-- CreateIndex
CREATE INDEX "transactions_category_id_date_idx" ON "public"."transactions"("category_id", "date");

-- CreateIndex
CREATE INDEX "transactions_type_date_idx" ON "public"."transactions"("type", "date");

-- CreateIndex
CREATE INDEX "transactions_user_id_type_date_idx" ON "public"."transactions"("user_id", "type", "date");

-- CreateIndex
CREATE INDEX "transactions_user_id_account_id_date_idx" ON "public"."transactions"("user_id", "account_id", "date");

-- CreateIndex
CREATE INDEX "transactions_user_id_category_id_date_idx" ON "public"."transactions"("user_id", "category_id", "date");

-- CreateIndex
CREATE INDEX "transactions_deleted_at_idx" ON "public"."transactions"("deleted_at");

-- CreateIndex
CREATE INDEX "transactions_is_reconciled_idx" ON "public"."transactions"("is_reconciled");

-- CreateIndex
CREATE INDEX "budgets_user_id_is_active_idx" ON "public"."budgets"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "budgets_category_id_start_date_end_date_idx" ON "public"."budgets"("category_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "budgets_period_idx" ON "public"."budgets"("period");

-- CreateIndex
CREATE INDEX "budgets_deleted_at_idx" ON "public"."budgets"("deleted_at");

-- CreateIndex
CREATE INDEX "budgets_user_id_period_is_active_idx" ON "public"."budgets"("user_id", "period", "is_active");

-- CreateIndex
CREATE INDEX "goals_user_id_is_completed_idx" ON "public"."goals"("user_id", "is_completed");

-- CreateIndex
CREATE INDEX "goals_type_idx" ON "public"."goals"("type");

-- CreateIndex
CREATE INDEX "goals_target_date_idx" ON "public"."goals"("target_date");

-- CreateIndex
CREATE INDEX "goals_deleted_at_idx" ON "public"."goals"("deleted_at");

-- CreateIndex
CREATE INDEX "goals_user_id_type_is_completed_idx" ON "public"."goals"("user_id", "type", "is_completed");

-- AddForeignKey
ALTER TABLE "public"."exchange_rates" ADD CONSTRAINT "exchange_rates_from_currency_id_fkey" FOREIGN KEY ("from_currency_id") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exchange_rates" ADD CONSTRAINT "exchange_rates_to_currency_id_fkey" FOREIGN KEY ("to_currency_id") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_transfer_to_id_fkey" FOREIGN KEY ("transfer_to_id") REFERENCES "public"."transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."budgets" ADD CONSTRAINT "budgets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."budgets" ADD CONSTRAINT "budgets_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."budgets" ADD CONSTRAINT "budgets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."goals" ADD CONSTRAINT "goals_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
