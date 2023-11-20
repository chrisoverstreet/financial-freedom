/*
  Warnings:

  - Added the required column `plaid_id` to the `PlaidAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlaidAccount" ADD COLUMN     "plaid_id" TEXT NOT NULL;
