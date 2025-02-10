/*
  Warnings:

  - You are about to drop the column `status` on the `Maintenance` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Maintenance_status_idx";

-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "status";
