-- CreateTable
CREATE TABLE "Credentails" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "ApiName" TEXT,
    "Application" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credentails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Credentails" ADD CONSTRAINT "Credentails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
