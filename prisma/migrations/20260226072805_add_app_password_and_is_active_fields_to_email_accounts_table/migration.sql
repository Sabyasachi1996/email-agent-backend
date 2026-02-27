/*
  Warnings:

  - Added the required column `app_password` to the `email_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_accounts" ADD COLUMN     "app_password" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false;
