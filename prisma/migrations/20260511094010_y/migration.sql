-- CreateTable
CREATE TABLE "watchlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userAddress" TEXT NOT NULL,
    "watchedAddress" TEXT NOT NULL,
    "label" TEXT,
    "lastScore" INTEGER NOT NULL DEFAULT 0,
    "prevScore" INTEGER NOT NULL DEFAULT 0,
    "alertOnChange" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "watchlist_userAddress_idx" ON "watchlist"("userAddress");

-- CreateIndex
CREATE INDEX "watchlist_watchedAddress_idx" ON "watchlist"("watchedAddress");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_userAddress_watchedAddress_key" ON "watchlist"("userAddress", "watchedAddress");
