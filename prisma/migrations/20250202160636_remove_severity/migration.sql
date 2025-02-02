/*
  Warnings:

  - You are about to drop the column `severity` on the `Incident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "severity";

-- DropEnum
DROP TYPE "IncidentSeverity";
