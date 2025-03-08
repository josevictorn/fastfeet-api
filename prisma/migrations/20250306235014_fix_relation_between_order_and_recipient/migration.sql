/*
  Warnings:

  - Made the column `recipient_at` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_delivery_man_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_recipient_at_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "recipient_at" SET NOT NULL,
ALTER COLUMN "delivery_man_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_at_fkey" FOREIGN KEY ("recipient_at") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_man_id_fkey" FOREIGN KEY ("delivery_man_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
