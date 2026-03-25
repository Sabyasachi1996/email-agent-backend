-- CreateTable
CREATE TABLE "calendar_accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "email_address" VARCHAR(150) NOT NULL,
    "auth_id" TEXT,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "provider" VARCHAR(80) NOT NULL DEFAULT 'custom',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "calendar_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calendar_accounts_email_address_key" ON "calendar_accounts"("email_address");

-- AddForeignKey
ALTER TABLE "calendar_accounts" ADD CONSTRAINT "calendar_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
