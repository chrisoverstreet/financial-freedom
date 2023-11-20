/*
  Warnings:

  - A unique constraint covering the columns `[plaid_id]` on the table `user_plaid_config` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plaid_id` to the `user_plaid_config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_plaid_config" ADD COLUMN     "plaid_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_plaid_config_plaid_id_key" ON "user_plaid_config"("plaid_id");
