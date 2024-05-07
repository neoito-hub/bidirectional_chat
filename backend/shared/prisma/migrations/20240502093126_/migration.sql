/*
  Warnings:

  - You are about to drop the column `receiver_id` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chat" DROP COLUMN "receiver_id",
DROP COLUMN "sender_id";
