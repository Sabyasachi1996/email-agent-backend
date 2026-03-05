-- AlterTable
ALTER TABLE "email_accounts" ADD COLUMN     "imap_host" VARCHAR(100),
ADD COLUMN     "imap_port" VARCHAR(100),
ADD COLUMN     "provider" VARCHAR(80) NOT NULL DEFAULT 'custom',
ADD COLUMN     "smtp_host" VARCHAR(100),
ADD COLUMN     "smtp_port" VARCHAR(100);
