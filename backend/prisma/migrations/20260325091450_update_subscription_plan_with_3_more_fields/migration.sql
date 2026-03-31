/*
  Warnings:

  - Added the required column `billing_interval` to the `subscription_plans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "subscription_plans" ADD COLUMN     "billing_interval" "BillingInterval" NOT NULL,
ADD COLUMN     "gateway_customer_notify" INTEGER,
ADD COLUMN     "gateway_total_count" INTEGER;
