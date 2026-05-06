-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "chain" TEXT NOT NULL DEFAULT '0g-newton',
    "addressType" TEXT NOT NULL DEFAULT 'EOA',
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "totalReports" INTEGER NOT NULL DEFAULT 0,
    "firstSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "threat_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "addressId" TEXT NOT NULL,
    "reporterAddress" TEXT NOT NULL,
    "threatType" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "evidenceHash" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "transactionHash" TEXT,
    "aiModel" TEXT NOT NULL DEFAULT 'gpt-4',
    "confidence" INTEGER NOT NULL,
    "simulationData" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "verifiedBy" TEXT,
    "verifiedAt" DATETIME,
    "onchainTxHash" TEXT,
    "blockNumber" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "threat_reports_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transaction_scans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "addressId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" TEXT,
    "data" TEXT,
    "simulationSuccess" BOOLEAN NOT NULL,
    "gasUsed" TEXT,
    "stateChanges" TEXT,
    "riskScore" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "detectedThreats" TEXT,
    "scanDuration" INTEGER,
    "agentVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transaction_scans_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reputation_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "addressId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL DEFAULT 0,
    "reporterScore" INTEGER NOT NULL DEFAULT 0,
    "accuracyScore" INTEGER NOT NULL DEFAULT 0,
    "reportsSubmitted" INTEGER NOT NULL DEFAULT 0,
    "reportsVerified" INTEGER NOT NULL DEFAULT 0,
    "reportsRejected" INTEGER NOT NULL DEFAULT 0,
    "onchainReputation" INTEGER,
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reputation_scores_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "scansPerformed" INTEGER NOT NULL DEFAULT 0,
    "threatsDetected" INTEGER NOT NULL DEFAULT 0,
    "reportsSubmitted" INTEGER NOT NULL DEFAULT 0,
    "autoReport" BOOLEAN NOT NULL DEFAULT false,
    "notifyOnThreat" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userAddress" TEXT,
    "searchType" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "result" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "sync_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordsAdded" INTEGER NOT NULL DEFAULT 0,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "addresses_address_key" ON "addresses"("address");

-- CreateIndex
CREATE INDEX "addresses_riskScore_idx" ON "addresses"("riskScore");

-- CreateIndex
CREATE INDEX "addresses_riskLevel_idx" ON "addresses"("riskLevel");

-- CreateIndex
CREATE INDEX "addresses_chain_idx" ON "addresses"("chain");

-- CreateIndex
CREATE INDEX "threat_reports_addressId_idx" ON "threat_reports"("addressId");

-- CreateIndex
CREATE INDEX "threat_reports_reporterAddress_idx" ON "threat_reports"("reporterAddress");

-- CreateIndex
CREATE INDEX "threat_reports_threatType_idx" ON "threat_reports"("threatType");

-- CreateIndex
CREATE INDEX "threat_reports_riskLevel_idx" ON "threat_reports"("riskLevel");

-- CreateIndex
CREATE INDEX "threat_reports_status_idx" ON "threat_reports"("status");

-- CreateIndex
CREATE INDEX "threat_reports_createdAt_idx" ON "threat_reports"("createdAt");

-- CreateIndex
CREATE INDEX "transaction_scans_addressId_idx" ON "transaction_scans"("addressId");

-- CreateIndex
CREATE INDEX "transaction_scans_from_idx" ON "transaction_scans"("from");

-- CreateIndex
CREATE INDEX "transaction_scans_riskLevel_idx" ON "transaction_scans"("riskLevel");

-- CreateIndex
CREATE INDEX "transaction_scans_createdAt_idx" ON "transaction_scans"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "reputation_scores_addressId_key" ON "reputation_scores"("addressId");

-- CreateIndex
CREATE INDEX "reputation_scores_overallScore_idx" ON "reputation_scores"("overallScore");

-- CreateIndex
CREATE INDEX "reputation_scores_reporterScore_idx" ON "reputation_scores"("reporterScore");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_address_key" ON "user_profiles"("address");

-- CreateIndex
CREATE INDEX "search_history_userAddress_idx" ON "search_history"("userAddress");

-- CreateIndex
CREATE INDEX "search_history_createdAt_idx" ON "search_history"("createdAt");

-- CreateIndex
CREATE INDEX "sync_logs_source_idx" ON "sync_logs"("source");

-- CreateIndex
CREATE INDEX "sync_logs_startedAt_idx" ON "sync_logs"("startedAt");
