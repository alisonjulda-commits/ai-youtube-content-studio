-- CreateTable
CREATE TABLE "ResearchNotes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sources" TEXT,
    "keywords" TEXT,
    "insights" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ThumbnailPrompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "style" TEXT NOT NULL DEFAULT 'modern',
    "keywords" TEXT,
    "colors" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "YoutubeUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "videoId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "playlist" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "uploadedAt" DATETIME,
    "youtubeUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VideoIdea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'idea',
    "tags" TEXT,
    "notes" TEXT,
    "workflowStep" TEXT NOT NULL DEFAULT 'idea',
    "researchNotesId" TEXT,
    "scriptId" TEXT,
    "seoDataId" TEXT,
    "thumbnailPromptId" TEXT,
    "videoId" TEXT,
    "youtubeUploadId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VideoIdea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VideoIdea_researchNotesId_fkey" FOREIGN KEY ("researchNotesId") REFERENCES "ResearchNotes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VideoIdea_thumbnailPromptId_fkey" FOREIGN KEY ("thumbnailPromptId") REFERENCES "ThumbnailPrompt" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VideoIdea_youtubeUploadId_fkey" FOREIGN KEY ("youtubeUploadId") REFERENCES "YoutubeUpload" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_VideoIdea" ("category", "createdAt", "description", "difficulty", "id", "notes", "priority", "status", "tags", "title", "updatedAt", "userId") SELECT "category", "createdAt", "description", "difficulty", "id", "notes", "priority", "status", "tags", "title", "updatedAt", "userId" FROM "VideoIdea";
DROP TABLE "VideoIdea";
ALTER TABLE "new_VideoIdea" RENAME TO "VideoIdea";
CREATE INDEX "VideoIdea_userId_idx" ON "VideoIdea"("userId");
CREATE INDEX "VideoIdea_workflowStep_idx" ON "VideoIdea"("workflowStep");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
