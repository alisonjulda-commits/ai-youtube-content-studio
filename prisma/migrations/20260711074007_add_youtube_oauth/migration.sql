-- CreateTable
CREATE TABLE "YouTubeAuth" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiry" DATETIME NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
    "channelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "profileImage" TEXT,
    "connectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastRefreshed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YouTubeAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL DEFAULT 'Julda Marie Alison',
    "channelName" TEXT NOT NULL DEFAULT 'Julda Marie Alison',
    "channelDescription" TEXT,
    "anthropicApiKey" TEXT,
    "openaiApiKey" TEXT,
    "brandPrimaryColor" TEXT NOT NULL DEFAULT '#6366f1',
    "brandSecondaryColor" TEXT NOT NULL DEFAULT '#ec4899',
    "theme" TEXT NOT NULL DEFAULT 'system',
    "youtubeConnected" BOOLEAN NOT NULL DEFAULT false,
    "youtubeChannelId" TEXT,
    "youtubeChannelName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Settings" ("anthropicApiKey", "brandPrimaryColor", "brandSecondaryColor", "channelDescription", "channelName", "createdAt", "id", "openaiApiKey", "ownerName", "theme", "updatedAt", "userId") SELECT "anthropicApiKey", "brandPrimaryColor", "brandSecondaryColor", "channelDescription", "channelName", "createdAt", "id", "openaiApiKey", "ownerName", "theme", "updatedAt", "userId" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeAuth_userId_key" ON "YouTubeAuth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeAuth_channelId_key" ON "YouTubeAuth"("channelId");

-- CreateIndex
CREATE INDEX "YouTubeAuth_userId_idx" ON "YouTubeAuth"("userId");

-- CreateIndex
CREATE INDEX "YouTubeAuth_channelId_idx" ON "YouTubeAuth"("channelId");
