/*
  Warnings:

  - You are about to drop the `MaintenanceComponent` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `MaintenanceTimeline` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "MaintenanceComponent" DROP CONSTRAINT "MaintenanceComponent_componentId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceComponent" DROP CONSTRAINT "MaintenanceComponent_maintenanceId_fkey";

-- AlterTable
ALTER TABLE "MaintenanceTimeline" DROP COLUMN "status",
ADD COLUMN     "status" "IncidentStatus" NOT NULL;

-- DropTable
DROP TABLE "MaintenanceComponent";
