/*
  Warnings:

  - Added the required column `item_id` to the `user_plaid_config` table without a default value. This is not possible if the table is not empty.
  - Made the column `access_token` on table `user_plaid_config` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_plaid_config" ADD COLUMN     "institutionId" TEXT,
ADD COLUMN     "item_id" TEXT NOT NULL,
ALTER COLUMN "access_token" SET NOT NULL;

-- CreateTable
CREATE TABLE "PlaidAccount" (
    "id" SERIAL NOT NULL,
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

    CONSTRAINT "PlaidAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlaidAccount" ADD CONSTRAINT "PlaidAccount_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "user_plaid_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
