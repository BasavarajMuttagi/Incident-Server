/*
  Warnings:

  - You are about to drop the column `userId` on the `Component` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Component_userId_idx";

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "userId";
