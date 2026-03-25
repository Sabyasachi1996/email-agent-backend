-- CreateEnum
CREATE TYPE "AIResponseTone" AS ENUM ('CASUAL', 'PROFESSIONAL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ai_response_tone" "AIResponseTone" NOT NULL DEFAULT 'PROFESSIONAL',
ADD COLUMN     "is_automation_active" BOOLEAN NOT NULL DEFAULT true;
