-- CreateTable
CREATE TABLE "ThumbnailDesign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "videoIdeaId" TEXT,
    "templateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "colors" TEXT NOT NULL,
    "textOverrides" TEXT NOT NULL,
    "svgContent" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ThumbnailDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ThumbnailDesign_videoIdeaId_fkey" FOREIGN KEY ("videoIdeaId") REFERENCES "VideoIdea" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ThumbnailDesign_userId_idx" ON "ThumbnailDesign"("userId");

-- CreateIndex
CREATE INDEX "ThumbnailDesign_videoIdeaId_idx" ON "ThumbnailDesign"("videoIdeaId");
