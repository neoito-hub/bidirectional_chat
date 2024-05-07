/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IndividualChatDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IndividualChatDetail" DROP CONSTRAINT "IndividualChatDetail_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "IndividualChatDetail" DROP CONSTRAINT "IndividualChatDetail_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Participants" DROP CONSTRAINT "Participants_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "Participants" DROP CONSTRAINT "Participants_contact_id_fkey";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "IndividualChatDetail";

-- DropTable
DROP TABLE "Participants";

-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "country_code" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "channel_id" TEXT,
    "email" TEXT,
    "address" TEXT,
    "registered_user" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat" (
    "id" TEXT NOT NULL,
    "chat_name" TEXT,
    "status" TEXT,
    "chat_uid" TEXT,
    "latest_message" TEXT,
    "receiver_id" TEXT,
    "sender_id" TEXT,
    "channel_id" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "individual_chat_detail" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "individual_chat_detail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_id_key" ON "contact"("id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_phone_number_key" ON "contact"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "contact_email_key" ON "contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "chat_id_key" ON "chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "participants_id_key" ON "participants"("id");

-- CreateIndex
CREATE UNIQUE INDEX "individual_chat_detail_id_key" ON "individual_chat_detail"("id");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individual_chat_detail" ADD CONSTRAINT "individual_chat_detail_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individual_chat_detail" ADD CONSTRAINT "individual_chat_detail_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
