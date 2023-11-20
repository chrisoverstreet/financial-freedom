/*
  Warnings:

  - A unique constraint covering the columns `[plaid_id]` on the table `PlaidAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlaidAccount_plaid_id_key" ON "PlaidAccount"("plaid_id");
