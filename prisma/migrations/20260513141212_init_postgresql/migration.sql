-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "chain" TEXT NOT NULL DEFAULT '0g-galileo',
    "addressType" TEXT NOT NULL DEFAULT 'EOA',
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "totalReports" INTEGER NOT NULL DEFAULT 0,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threat_reports" (
    "id" TEXT NOT NULL,
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
    "localStatus" TEXT NOT NULL DEFAULT 'PENDING_LOCAL',
    "onchainStatus" TEXT NOT NULL DEFAULT 'NONE',
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "reportHash" TEXT,
    "onchainTxHash" TEXT,
    "blockNumber" INTEGER,
    "chainId" INTEGER,
    "contractAddress" TEXT,
    "relayError" TEXT,
    "relayAttempts" INTEGER NOT NULL DEFAULT 0,
    "nextRelayAt" TIMESTAMP(3),
    "relayedAt" TIMESTAMP(3),
    "deadLetter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "threat_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_scans" (
    "id" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" BIGINT,
    "data" TEXT,
    "simulationSuccess" BOOLEAN NOT NULL,
    "gasUsed" BIGINT,
    "stateChanges" TEXT,
    "riskScore" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "detectedThreats" TEXT,
    "scanDuration" INTEGER,
    "agentVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reputation_scores" (
    "id" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL DEFAULT 0,
    "reporterScore" INTEGER NOT NULL DEFAULT 0,
    "accuracyScore" INTEGER NOT NULL DEFAULT 0,
    "reportsSubmitted" INTEGER NOT NULL DEFAULT 0,
    "reportsVerified" INTEGER NOT NULL DEFAULT 0,
    "reportsRejected" INTEGER NOT NULL DEFAULT 0,
    "onchainReputation" INTEGER,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reputation_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "scansPerformed" INTEGER NOT NULL DEFAULT 0,
    "threatsDetected" INTEGER NOT NULL DEFAULT 0,
    "reportsSubmitted" INTEGER NOT NULL DEFAULT 0,
    "autoReport" BOOLEAN NOT NULL DEFAULT false,
    "notifyOnThreat" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" TEXT NOT NULL,
    "userAddress" TEXT,
    "searchType" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_logs" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordsAdded" INTEGER NOT NULL DEFAULT 0,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_state" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastBlock" INTEGER NOT NULL DEFAULT 0,
    "chainId" INTEGER NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'onchain',
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastSyncAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorMessage" TEXT,
    "metadata" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "aiProvider" TEXT NOT NULL DEFAULT 'default',
    "aiApiKey" TEXT,
    "aiBaseUrl" TEXT,
    "aiModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extension_sessions" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "extension_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scam_domains" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 80,
    "category" TEXT NOT NULL DEFAULT 'PHISHING',
    "description" TEXT,
    "source" TEXT NOT NULL DEFAULT 'COMMUNITY',
    "reportedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scam_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address_tags" (
    "id" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "taggedBy" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlist" (
    "id" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "watchedAddress" TEXT NOT NULL,
    "label" TEXT,
    "lastScore" INTEGER NOT NULL DEFAULT 0,
    "prevScore" INTEGER NOT NULL DEFAULT 0,
    "alertOnChange" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_history" (
    "id" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "reasoning" TEXT,
    "threats" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rootHash" TEXT,
    "storageExplorer" TEXT,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_votes" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "voterAddress" TEXT NOT NULL,
    "voteType" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction_accuracy" (
    "id" TEXT NOT NULL,
    "targetAddress" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "predictedRiskScore" INTEGER NOT NULL,
    "predictedRiskLevel" TEXT NOT NULL,
    "predictedConfidence" INTEGER NOT NULL,
    "predictedRecommendation" TEXT NOT NULL,
    "predictedThreats" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'default',
    "actualOutcome" TEXT,
    "isCorrect" BOOLEAN,
    "groundTruthSource" TEXT,
    "goPlusRiskScore" INTEGER,
    "communityRiskLevel" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prediction_accuracy_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "threat_reports_addressId_status_idx" ON "threat_reports"("addressId", "status");

-- CreateIndex
CREATE INDEX "threat_reports_riskLevel_status_idx" ON "threat_reports"("riskLevel", "status");

-- CreateIndex
CREATE INDEX "threat_reports_reporterAddress_createdAt_idx" ON "threat_reports"("reporterAddress", "createdAt");

-- CreateIndex
CREATE INDEX "threat_reports_localStatus_idx" ON "threat_reports"("localStatus");

-- CreateIndex
CREATE INDEX "threat_reports_onchainStatus_idx" ON "threat_reports"("onchainStatus");

-- CreateIndex
CREATE INDEX "transaction_scans_addressId_idx" ON "transaction_scans"("addressId");

-- CreateIndex
CREATE INDEX "transaction_scans_from_idx" ON "transaction_scans"("from");

-- CreateIndex
CREATE INDEX "transaction_scans_riskLevel_idx" ON "transaction_scans"("riskLevel");

-- CreateIndex
CREATE INDEX "transaction_scans_createdAt_idx" ON "transaction_scans"("createdAt");

-- CreateIndex
CREATE INDEX "transaction_scans_addressId_riskLevel_idx" ON "transaction_scans"("addressId", "riskLevel");

-- CreateIndex
CREATE INDEX "transaction_scans_from_createdAt_idx" ON "transaction_scans"("from", "createdAt");

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

-- CreateIndex
CREATE UNIQUE INDEX "sync_state_name_key" ON "sync_state"("name");

-- CreateIndex
CREATE INDEX "sync_state_name_idx" ON "sync_state"("name");

-- CreateIndex
CREATE INDEX "sync_state_chainId_idx" ON "sync_state"("chainId");

-- CreateIndex
CREATE INDEX "sync_state_status_idx" ON "sync_state"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_address_key" ON "user_settings"("address");

-- CreateIndex
CREATE INDEX "user_settings_address_idx" ON "user_settings"("address");

-- CreateIndex
CREATE UNIQUE INDEX "extension_sessions_token_key" ON "extension_sessions"("token");

-- CreateIndex
CREATE INDEX "extension_sessions_token_idx" ON "extension_sessions"("token");

-- CreateIndex
CREATE INDEX "extension_sessions_walletAddress_idx" ON "extension_sessions"("walletAddress");

-- CreateIndex
CREATE INDEX "extension_sessions_expiresAt_idx" ON "extension_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "scam_domains_domain_key" ON "scam_domains"("domain");

-- CreateIndex
CREATE INDEX "scam_domains_domain_idx" ON "scam_domains"("domain");

-- CreateIndex
CREATE INDEX "scam_domains_category_idx" ON "scam_domains"("category");

-- CreateIndex
CREATE INDEX "scam_domains_isActive_idx" ON "scam_domains"("isActive");

-- CreateIndex
CREATE INDEX "address_tags_addressId_idx" ON "address_tags"("addressId");

-- CreateIndex
CREATE INDEX "address_tags_tag_idx" ON "address_tags"("tag");

-- CreateIndex
CREATE INDEX "address_tags_taggedBy_idx" ON "address_tags"("taggedBy");

-- CreateIndex
CREATE UNIQUE INDEX "address_tags_addressId_tag_key" ON "address_tags"("addressId", "tag");

-- CreateIndex
CREATE INDEX "watchlist_userAddress_idx" ON "watchlist"("userAddress");

-- CreateIndex
CREATE INDEX "watchlist_watchedAddress_idx" ON "watchlist"("watchedAddress");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_userAddress_watchedAddress_key" ON "watchlist"("userAddress", "watchedAddress");

-- CreateIndex
CREATE INDEX "scan_history_fromAddress_idx" ON "scan_history"("fromAddress");

-- CreateIndex
CREATE INDEX "scan_history_toAddress_idx" ON "scan_history"("toAddress");

-- CreateIndex
CREATE INDEX "scan_history_riskLevel_idx" ON "scan_history"("riskLevel");

-- CreateIndex
CREATE INDEX "scan_history_analyzedAt_idx" ON "scan_history"("analyzedAt");

-- CreateIndex
CREATE INDEX "report_votes_reportId_idx" ON "report_votes"("reportId");

-- CreateIndex
CREATE INDEX "report_votes_voterAddress_idx" ON "report_votes"("voterAddress");

-- CreateIndex
CREATE UNIQUE INDEX "report_votes_reportId_voterAddress_key" ON "report_votes"("reportId", "voterAddress");

-- CreateIndex
CREATE INDEX "prediction_accuracy_targetAddress_idx" ON "prediction_accuracy"("targetAddress");

-- CreateIndex
CREATE INDEX "prediction_accuracy_analysisType_idx" ON "prediction_accuracy"("analysisType");

-- CreateIndex
CREATE INDEX "prediction_accuracy_predictedRiskLevel_idx" ON "prediction_accuracy"("predictedRiskLevel");

-- CreateIndex
CREATE INDEX "prediction_accuracy_provider_idx" ON "prediction_accuracy"("provider");

-- CreateIndex
CREATE INDEX "prediction_accuracy_isCorrect_idx" ON "prediction_accuracy"("isCorrect");

-- CreateIndex
CREATE INDEX "prediction_accuracy_createdAt_idx" ON "prediction_accuracy"("createdAt");

-- AddForeignKey
ALTER TABLE "threat_reports" ADD CONSTRAINT "threat_reports_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_scans" ADD CONSTRAINT "transaction_scans_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reputation_scores" ADD CONSTRAINT "reputation_scores_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address_tags" ADD CONSTRAINT "address_tags_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_votes" ADD CONSTRAINT "report_votes_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "threat_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
