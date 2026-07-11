/*
  Warnings:

  - You are about to drop the column `youtubeUploadId` on the `VideoIdea` table. All the data in the column will be lost.
  - You are about to drop the column `playlist` on the `YoutubeUpload` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `YoutubeUpload` table. All the data in the column will be lost.

*/
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VideoIdea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VideoIdea_researchNotesId_fkey" FOREIGN KEY ("researchNotesId") REFERENCES "ResearchNotes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VideoIdea_thumbnailPromptId_fkey" FOREIGN KEY ("thumbnailPromptId") REFERENCES "ThumbnailPrompt" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_VideoIdea" ("category", "createdAt", "description", "difficulty", "id", "notes", "priority", "researchNotesId", "scriptId", "seoDataId", "status", "tags", "thumbnailPromptId", "title", "updatedAt", "userId", "videoId", "workflowStep") SELECT "category", "createdAt", "description", "difficulty", "id", "notes", "priority", "researchNotesId", "scriptId", "seoDataId", "status", "tags", "thumbnailPromptId", "title", "updatedAt", "userId", "videoId", "workflowStep" FROM "VideoIdea";
DROP TABLE "VideoIdea";
ALTER TABLE "new_VideoIdea" RENAME TO "VideoIdea";
CREATE INDEX "VideoIdea_userId_idx" ON "VideoIdea"("userId");
CREATE INDEX "VideoIdea_workflowStep_idx" ON "VideoIdea"("workflowStep");
CREATE TABLE "new_YoutubeUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "videoIdeaId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "category" TEXT NOT NULL DEFAULT '22',
    "language" TEXT NOT NULL DEFAULT 'en',
    "license" TEXT NOT NULL DEFAULT 'creativeCommon',
    "videoPath" TEXT,
    "videoSize" INTEGER,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "scheduledPublishAt" DATETIME,
    "thumbnailPath" TEXT,
    "thumbnailUrl" TEXT,
    "restrictions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "uploadProgress" INTEGER NOT NULL DEFAULT 0,
    "youtubeVideoId" TEXT,
    "youtubeUrl" TEXT,
    "uploadedAt" DATETIME,
    "errorMessage" TEXT,
    "errorCode" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YoutubeUpload_videoIdeaId_fkey" FOREIGN KEY ("videoIdeaId") REFERENCES "VideoIdea" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_YoutubeUpload" ("createdAt", "description", "id", "tags", "title", "updatedAt", "uploadedAt", "userId", "visibility", "youtubeUrl") SELECT "createdAt", "description", "id", "tags", "title", "updatedAt", "uploadedAt", "userId", "visibility", "youtubeUrl" FROM "YoutubeUpload";
DROP TABLE "YoutubeUpload";
ALTER TABLE "new_YoutubeUpload" RENAME TO "YoutubeUpload";
CREATE UNIQUE INDEX "YoutubeUpload_youtubeVideoId_key" ON "YoutubeUpload"("youtubeVideoId");
CREATE INDEX "YoutubeUpload_userId_idx" ON "YoutubeUpload"("userId");
CREATE INDEX "YoutubeUpload_videoIdeaId_idx" ON "YoutubeUpload"("videoIdeaId");
CREATE INDEX "YoutubeUpload_status_idx" ON "YoutubeUpload"("status");
CREATE INDEX "YoutubeUpload_scheduledPublishAt_idx" ON "YoutubeUpload"("scheduledPublishAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
