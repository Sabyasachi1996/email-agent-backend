/*
  Warnings:

  - You are about to drop the `EmailActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailActivity" DROP CONSTRAINT "EmailActivity_email_account_id_fkey";

-- DropForeignKey
ALTER TABLE "EmailActivity" DROP CONSTRAINT "EmailActivity_user_id_fkey";

-- DropTable
DROP TABLE "EmailActivity";

-- CreateTable
CREATE TABLE "email_activities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "email_account_id" UUID NOT NULL,
    "message_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "email_activities" ADD CONSTRAINT "email_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_activities" ADD CONSTRAINT "email_activities_email_account_id_fkey" FOREIGN KEY ("email_account_id") REFERENCES "email_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
