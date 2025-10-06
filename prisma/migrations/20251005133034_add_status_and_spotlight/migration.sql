-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isSpotlight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'completed';
