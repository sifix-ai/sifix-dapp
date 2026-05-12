-- CreateTable
CREATE TABLE "scam_domains" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 80,
    "category" TEXT NOT NULL DEFAULT 'PHISHING',
    "description" TEXT,
    "source" TEXT NOT NULL DEFAULT 'COMMUNITY',
    "reportedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "address_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "addressId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "taggedBy" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "address_tags_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scan_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "reasoning" TEXT,
    "threats" TEXT,
    "confidence" REAL NOT NULL DEFAULT 0,
    "rootHash" TEXT,
    "storageExplorer" TEXT,
    "analyzedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
CREATE INDEX "scan_history_fromAddress_idx" ON "scan_history"("fromAddress");

-- CreateIndex
CREATE INDEX "scan_history_toAddress_idx" ON "scan_history"("toAddress");

-- CreateIndex
CREATE INDEX "scan_history_riskLevel_idx" ON "scan_history"("riskLevel");

-- CreateIndex
CREATE INDEX "scan_history_analyzedAt_idx" ON "scan_history"("analyzedAt");
