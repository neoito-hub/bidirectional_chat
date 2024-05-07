/*
  Warnings:

  - Added the required column `type` to the `individual_chat_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "individual_chat_detail" ADD COLUMN     "type" TEXT NOT NULL;
