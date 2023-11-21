/*
  Warnings:

  - You are about to drop the `PlaidAccount` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `institutionId` to the `user_plaid_config` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlaidAccount" DROP CONSTRAINT "PlaidAccount_item_id_fkey";

-- DropForeignKey
ALTER TABLE "user_plaid_config" DROP CONSTRAINT "user_plaid_config_user_id_fkey";

-- AlterTable
ALTER TABLE "user_plaid_config" DROP COLUMN "institutionId",
ADD COLUMN     "institutionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PlaidAccount";

-- CreateTable
CREATE TABLE "plaid_account" (
    "id" SERIAL NOT NULL,
    "plaid_id" TEXT NOT NULL,
    "item_id" INTEGER NOT NULL,
    "mask" TEXT,
    "name" TEXT NOT NULL,
    "officialName" TEXT,
    "type" TEXT NOT NULL,
    "subtype" TEXT,
    "availableBalance" INTEGER,
    "currentBalance" INTEGER,
    "ISOCurrencyCode" TEXT,
    "limit" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plaid_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plaid_institution" (
    "id" SERIAL NOT NULL,
    "plaid_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryColor" TEXT,
    "url" TEXT,
    "logo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plaid_institution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plaid_account_plaid_id_key" ON "plaid_account"("plaid_id");

-- CreateIndex
CREATE UNIQUE INDEX "plaid_institution_plaid_id_key" ON "plaid_institution"("plaid_id");

-- AddForeignKey
ALTER TABLE "user_plaid_config" ADD CONSTRAINT "user_plaid_config_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_plaid_config" ADD CONSTRAINT "user_plaid_config_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "plaid_institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_account" ADD CONSTRAINT "plaid_account_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "user_plaid_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;
