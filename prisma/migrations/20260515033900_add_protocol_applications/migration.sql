-- CreateTable
CREATE TABLE "protocol_applications" (
    "id" TEXT NOT NULL,
    "protocolName" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "useCase" TEXT NOT NULL,
    "requestedTier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protocol_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "protocol_applications_status_idx" ON "protocol_applications"("status");

-- CreateIndex
CREATE INDEX "protocol_applications_createdAt_idx" ON "protocol_applications"("createdAt");
