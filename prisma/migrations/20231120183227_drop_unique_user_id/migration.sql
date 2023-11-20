/*
  Warnings:

  - You are about to drop the column `item_id` on the `user_plaid_config` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PlaidAccount_plaid_id_key";

-- AlterTable
ALTER TABLE "user_plaid_config" DROP COLUMN "item_id";
