-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "path" TEXT,
    "ip" TEXT,
    "ua" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visits_createdAt_idx" ON "visits"("createdAt");
