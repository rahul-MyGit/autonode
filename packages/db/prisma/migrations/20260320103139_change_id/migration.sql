/*
  Warnings:

  - The primary key for the `WorkflowExecution` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "WorkflowExecution" DROP CONSTRAINT "WorkflowExecution_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WorkflowExecution_id_seq";
