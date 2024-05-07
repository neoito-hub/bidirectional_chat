-- DropIndex
DROP INDEX "Contact_address_key";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "channel_id" TEXT,
ADD COLUMN     "registered_user" BOOLEAN NOT NULL DEFAULT false;
