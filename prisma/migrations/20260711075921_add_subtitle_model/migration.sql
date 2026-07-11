-- CreateTable
CREATE TABLE "Subtitle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "videoIdeaId" TEXT,
    "scriptId" TEXT,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "format" TEXT NOT NULL DEFAULT 'srt',
    "content" TEXT NOT NULL,
    "lines" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subtitle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subtitle_videoIdeaId_fkey" FOREIGN KEY ("videoIdeaId") REFERENCES "VideoIdea" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Subtitle_userId_idx" ON "Subtitle"("userId");

-- CreateIndex
CREATE INDEX "Subtitle_videoIdeaId_idx" ON "Subtitle"("videoIdeaId");

-- CreateIndex
CREATE INDEX "Subtitle_scriptId_idx" ON "Subtitle"("scriptId");
