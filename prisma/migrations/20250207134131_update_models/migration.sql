/*
  Warnings:

  - You are about to drop the column `userId` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `IncidentComponent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MaintenanceComponent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Incident_userId_idx";

-- DropIndex
DROP INDEX "IncidentComponent_userId_idx";

-- DropIndex
DROP INDEX "Maintenance_userId_idx";

-- DropIndex
DROP INDEX "MaintenanceComponent_userId_idx";

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "IncidentComponent" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "MaintenanceComponent" DROP COLUMN "userId";
