/*
  Warnings:

  - Added the required column `occuredAt` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "occuredAt" TIMESTAMP(3) NOT NULL;
