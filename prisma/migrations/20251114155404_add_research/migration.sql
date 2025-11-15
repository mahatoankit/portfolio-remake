-- CreateTable
CREATE TABLE "Research" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "journal" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "doi" TEXT,
    "pdfUrl" TEXT,
    "externalUrl" TEXT,
    "citations" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "thumbnail" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Research_pkey" PRIMARY KEY ("id")
);
