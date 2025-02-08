/*
  Warnings:

  - You are about to drop the column `codeExpiresAt` on the `Subscriber` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verificationCode]` on the table `Subscriber` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[unsubscribeCode]` on the table `Subscriber` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unsubscribeCode` to the `Subscriber` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationCodeExpiresAt` to the `Subscriber` table without a default value. This is not possible if the table is not empty.
  - Made the column `verificationCode` on table `Subscriber` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "codeExpiresAt",
ADD COLUMN     "unsubscribeCode" TEXT NOT NULL,
ADD COLUMN     "verificationCodeExpiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "verificationCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_verificationCode_key" ON "Subscriber"("verificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_unsubscribeCode_key" ON "Subscriber"("unsubscribeCode");

-- CreateIndex
CREATE INDEX "Subscriber_unsubscribeCode_idx" ON "Subscriber"("unsubscribeCode");
