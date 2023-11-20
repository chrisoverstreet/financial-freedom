/*
  Warnings:

  - A unique constraint covering the columns `[plaid_id]` on the table `PlaidAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_plaid_config_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "PlaidAccount_plaid_id_key" ON "PlaidAccount"("plaid_id");
