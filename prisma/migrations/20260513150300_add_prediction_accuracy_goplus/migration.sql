-- CreateTable
CREATE TABLE "prediction_accuracy" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "prediction_accuracy_targetAddress_idx" ON "prediction_accuracy"("targetAddress");
CREATE INDEX "prediction_accuracy_analysisType_idx" ON "prediction_accuracy"("analysisType");
CREATE INDEX "prediction_accuracy_predictedRiskLevel_idx" ON "prediction_accuracy"("predictedRiskLevel");
CREATE INDEX "prediction_accuracy_provider_idx" ON "prediction_accuracy"("provider");
CREATE INDEX "prediction_accuracy_isCorrect_idx" ON "prediction_accuracy"("isCorrect");
CREATE INDEX "prediction_accuracy_createdAt_idx" ON "prediction_accuracy"("createdAt");
