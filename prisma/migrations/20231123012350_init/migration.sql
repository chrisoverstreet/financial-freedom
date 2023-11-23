-- CreateEnum
CREATE TYPE "plaid_account_type" AS ENUM ('investment', 'credit', 'depository', 'loan', 'brokerage', 'other');

-- CreateEnum
CREATE TYPE "plaid_verification_status" AS ENUM ('automatically_verified', 'pending_automatic_verification', 'pending_manual_verification', 'manually_verified', 'verification_expired', 'verification_failed', 'database_matched');

-- CreateEnum
CREATE TYPE "plaid_product" AS ENUM ('assets', 'auth', 'balance', 'credit_details', 'deposit_switch', 'employment', 'identity', 'identity_match', 'identity_verification', 'income', 'income_verification', 'investments', 'investments_auth', 'liabilities', 'payment_initiation', 'recurring_transactions', 'signal', 'standing_orders', 'statements', 'transactions', 'transfer');

-- CreateEnum
CREATE TYPE "plaid_country_code" AS ENUM ('US', 'GB', 'ES', 'NL', 'FR', 'IE', 'CA', 'DE', 'IT', 'PL', 'DK', 'NO', 'SE', 'EE', 'LT', 'LV', 'PT', 'BE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "plaid_balance" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "available" DOUBLE PRECISION,
    "current" DOUBLE PRECISION,
    "limit" DOUBLE PRECISION,
    "iso_currency_code" TEXT,
    "unofficial_currency_code" TEXT,
    "last_updated_datetime" TIMESTAMP(3),

    CONSTRAINT "plaid_balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plaid_account" (
    "account_id" TEXT NOT NULL,
    "mask" TEXT,
    "name" TEXT NOT NULL,
    "official_name" TEXT,
    "type" "plaid_account_type" NOT NULL,
    "subtype" TEXT,
    "verification_status" "plaid_verification_status",
    "persistent_account_id" TEXT,

    CONSTRAINT "plaid_account_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "plaid_item" (
    "item_id" TEXT NOT NULL,
    "institution_id" TEXT,
    "webhook" TEXT,
    "errorId" TEXT,
    "available_products" "plaid_product"[],
    "billed_products" "plaid_product"[],
    "products" "plaid_product"[],
    "consented_products" "plaid_product"[],
    "consent_expiration_time" TIMESTAMP(3),
    "update_type" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "plaid_item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "plaid_institution" (
    "institution_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "products" "plaid_product"[],
    "country_codes" "plaid_country_code"[],
    "url" TEXT,
    "primary_color" TEXT,
    "logo" TEXT,
    "routing_numbers" TEXT[],
    "dtc_numbers" TEXT[],
    "oauth" BOOLEAN NOT NULL,

    CONSTRAINT "plaid_institution_pkey" PRIMARY KEY ("institution_id")
);

-- CreateTable
CREATE TABLE "plaid_counterparty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity_id" TEXT,
    "type" TEXT NOT NULL,
    "website" TEXT,
    "logo_url" TEXT,
    "confidence_level" TEXT,
    "transaction_id" TEXT NOT NULL,

    CONSTRAINT "plaid_counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plaid_personal_finance_category" (
    "id" TEXT NOT NULL,
    "primary" TEXT NOT NULL,
    "detailed" TEXT NOT NULL,
    "confidence_level" TEXT,

    CONSTRAINT "plaid_personal_finance_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plaid_location" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "region" TEXT,
    "postal_code" TEXT,
    "country" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "store_number" TEXT,

    CONSTRAINT "plaid_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plaid_payment_meta" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT,
    "ppd_id" TEXT,
    "payee" TEXT,
    "by_order_of" TEXT,
    "payer" TEXT,
    "payment_method" TEXT,
    "payment_processor" TEXT,
    "reason" TEXT,

    CONSTRAINT "plaid_payment_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plaid_transaction" (
    "account_id" TEXT NOT NULL,
    "account_owner" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "authorized_date" TEXT,
    "authorized_datetime" TIMESTAMP(3),
    "check_number" TEXT,
    "date" TEXT NOT NULL,
    "datetime" TIMESTAMP(3),
    "iso_currency_code" TEXT,
    "location_id" TEXT NOT NULL,
    "logo_url" TEXT,
    "merchant_name" TEXT,
    "name" TEXT NOT NULL,
    "original_description" TEXT,
    "payment_meta_id" TEXT NOT NULL,
    "payment_channel" TEXT NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "pending_transaction_id" TEXT,
    "personal_finance_category_id" TEXT,
    "personal_finance_category_icon_url" TEXT NOT NULL,
    "transaction_code" TEXT,
    "transaction_id" TEXT NOT NULL,
    "unofficial_currency_code" TEXT,
    "website" TEXT,

    CONSTRAINT "plaid_transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_balance" ADD CONSTRAINT "plaid_balance_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "plaid_account"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_item" ADD CONSTRAINT "plaid_item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_counterparty" ADD CONSTRAINT "plaid_counterparty_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "plaid_transaction"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_transaction" ADD CONSTRAINT "plaid_transaction_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "plaid_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_transaction" ADD CONSTRAINT "plaid_transaction_payment_meta_id_fkey" FOREIGN KEY ("payment_meta_id") REFERENCES "plaid_payment_meta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_transaction" ADD CONSTRAINT "plaid_transaction_personal_finance_category_id_fkey" FOREIGN KEY ("personal_finance_category_id") REFERENCES "plaid_personal_finance_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_transaction" ADD CONSTRAINT "plaid_transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "plaid_account"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;
