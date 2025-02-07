/*
  Warnings:

  - Added the required column `userId` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `IncidentComponent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `IncidentComponent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `IncidentComponent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `IncidentTimeline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `MaintenanceComponent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MaintenanceComponent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `MaintenanceComponent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MaintenanceTimeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "IncidentComponent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IncidentTimeline" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceComponent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceTimeline" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Component_userId_idx" ON "Component"("userId");

-- CreateIndex
CREATE INDEX "Incident_userId_idx" ON "Incident"("userId");

-- CreateIndex
CREATE INDEX "IncidentComponent_orgId_idx" ON "IncidentComponent"("orgId");

-- CreateIndex
CREATE INDEX "IncidentComponent_userId_idx" ON "IncidentComponent"("userId");

-- CreateIndex
CREATE INDEX "IncidentTimeline_userId_idx" ON "IncidentTimeline"("userId");

-- CreateIndex
CREATE INDEX "Maintenance_userId_idx" ON "Maintenance"("userId");

-- CreateIndex
CREATE INDEX "MaintenanceComponent_orgId_idx" ON "MaintenanceComponent"("orgId");

-- CreateIndex
CREATE INDEX "MaintenanceComponent_userId_idx" ON "MaintenanceComponent"("userId");

-- CreateIndex
CREATE INDEX "MaintenanceTimeline_userId_idx" ON "MaintenanceTimeline"("userId");
