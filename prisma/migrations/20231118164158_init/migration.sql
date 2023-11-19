-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "stytch_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_stytch_id_key" ON "users"("stytch_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
