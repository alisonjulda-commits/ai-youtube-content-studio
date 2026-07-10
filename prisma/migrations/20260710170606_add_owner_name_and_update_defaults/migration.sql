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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Settings" ("anthropicApiKey", "brandPrimaryColor", "brandSecondaryColor", "channelDescription", "channelName", "createdAt", "id", "openaiApiKey", "theme", "updatedAt", "userId") SELECT "anthropicApiKey", "brandPrimaryColor", "brandSecondaryColor", "channelDescription", coalesce("channelName", 'Julda Marie Alison') AS "channelName", "createdAt", "id", "openaiApiKey", "theme", "updatedAt", "userId" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
