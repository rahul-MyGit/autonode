-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "refreshTokenExpiry" TIMESTAMP(3),
ALTER COLUMN "password" DROP NOT NULL;
