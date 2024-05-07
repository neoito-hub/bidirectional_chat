/*
  Warnings:

  - You are about to drop the column `vendor_type` on the `IndividualChatDetail` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `IndividualChatDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IndividualChatDetail" DROP COLUMN "vendor_type";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Participants" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participants_id_key" ON "Participants"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_id_key" ON "Contact"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IndividualChatDetail_id_key" ON "IndividualChatDetail"("id");

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualChatDetail" ADD CONSTRAINT "IndividualChatDetail_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
