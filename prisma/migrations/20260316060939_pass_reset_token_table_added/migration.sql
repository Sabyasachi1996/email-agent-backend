-- CreateTable
CREATE TABLE "pass_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pass_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pass_reset_tokens_token_key" ON "pass_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "pass_reset_tokens_user_id_idx" ON "pass_reset_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "pass_reset_tokens" ADD CONSTRAINT "pass_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
