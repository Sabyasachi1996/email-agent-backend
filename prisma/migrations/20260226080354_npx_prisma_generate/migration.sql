-- AlterTable
ALTER TABLE "email_accounts" ALTER COLUMN "access_token" DROP NOT NULL,
ALTER COLUMN "auth_id" DROP NOT NULL,
ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "app_password" DROP NOT NULL;
