/*
  Warnings:

  - The `imap_port` column on the `email_accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `smtp_port` column on the `email_accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "email_accounts" DROP COLUMN "imap_port",
ADD COLUMN     "imap_port" INTEGER,
DROP COLUMN "smtp_port",
ADD COLUMN     "smtp_port" INTEGER;
