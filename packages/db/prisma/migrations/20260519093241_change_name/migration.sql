/*
  Warnings:

  - You are about to drop the column `ApiName` on the `Credentails` table. All the data in the column will be lost.
  - You are about to drop the column `Application` on the `Credentails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Credentails" DROP COLUMN "ApiName",
DROP COLUMN "Application",
ADD COLUMN     "apiName" TEXT,
ADD COLUMN     "application" TEXT;
