/*
  Warnings:

  - You are about to drop the column `orgId` on the `IncidentComponent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `IncidentComponent` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `MaintenanceComponent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MaintenanceComponent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "IncidentComponent_orgId_idx";

-- DropIndex
DROP INDEX "MaintenanceComponent_orgId_idx";

-- AlterTable
ALTER TABLE "IncidentComponent" DROP COLUMN "orgId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "MaintenanceComponent" DROP COLUMN "orgId",
DROP COLUMN "userId";
