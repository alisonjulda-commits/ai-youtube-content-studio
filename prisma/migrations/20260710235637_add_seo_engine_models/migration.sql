-- CreateTable
CREATE TABLE "SEOTitles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "titles" TEXT NOT NULL,
    "selectedTitle" TEXT NOT NULL,
    "ctrScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEOTitles_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEODescriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "selectedDescription" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEODescriptions_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEOChapters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "chapters" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEOChapters_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEOTags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEOTags_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEOHashtags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "hashtags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEOHashtags_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEOKeywords" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "primaryKeyword" TEXT NOT NULL,
    "secondaryKeywords" TEXT NOT NULL,
    "longTailKeywords" TEXT NOT NULL,
    "searchCompetition" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEOKeywords_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentAssets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "thumbnailTexts" TEXT NOT NULL,
    "hookVariations" TEXT NOT NULL,
    "pinnedComments" TEXT NOT NULL,
    "communityPosts" TEXT NOT NULL,
    "youtubeShorts" TEXT NOT NULL,
    "blogArticle" TEXT NOT NULL,
    "linkedInPost" TEXT NOT NULL,
    "facebookPost" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentAssets_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEOScorecard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "keywordOptimization" INTEGER NOT NULL DEFAULT 0,
    "ctrPotential" INTEGER NOT NULL DEFAULT 0,
    "searchIntentMatch" INTEGER NOT NULL DEFAULT 0,
    "readability" INTEGER NOT NULL DEFAULT 0,
    "engagementPotential" INTEGER NOT NULL DEFAULT 0,
    "overallScore" INTEGER NOT NULL DEFAULT 0,
    "recommendations" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEOScorecard_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SEOTitles_scriptId_key" ON "SEOTitles"("scriptId");

-- CreateIndex
CREATE INDEX "SEOTitles_userId_idx" ON "SEOTitles"("userId");

-- CreateIndex
CREATE INDEX "SEOTitles_scriptId_idx" ON "SEOTitles"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "SEODescriptions_scriptId_key" ON "SEODescriptions"("scriptId");

-- CreateIndex
CREATE INDEX "SEODescriptions_userId_idx" ON "SEODescriptions"("userId");

-- CreateIndex
CREATE INDEX "SEODescriptions_scriptId_idx" ON "SEODescriptions"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "SEOChapters_scriptId_key" ON "SEOChapters"("scriptId");

-- CreateIndex
CREATE INDEX "SEOChapters_userId_idx" ON "SEOChapters"("userId");

-- CreateIndex
CREATE INDEX "SEOChapters_scriptId_idx" ON "SEOChapters"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "SEOTags_scriptId_key" ON "SEOTags"("scriptId");

-- CreateIndex
CREATE INDEX "SEOTags_userId_idx" ON "SEOTags"("userId");

-- CreateIndex
CREATE INDEX "SEOTags_scriptId_idx" ON "SEOTags"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "SEOHashtags_scriptId_key" ON "SEOHashtags"("scriptId");

-- CreateIndex
CREATE INDEX "SEOHashtags_userId_idx" ON "SEOHashtags"("userId");

-- CreateIndex
CREATE INDEX "SEOHashtags_scriptId_idx" ON "SEOHashtags"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "SEOKeywords_scriptId_key" ON "SEOKeywords"("scriptId");

-- CreateIndex
CREATE INDEX "SEOKeywords_userId_idx" ON "SEOKeywords"("userId");

-- CreateIndex
CREATE INDEX "SEOKeywords_scriptId_idx" ON "SEOKeywords"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentAssets_scriptId_key" ON "ContentAssets"("scriptId");

-- CreateIndex
CREATE INDEX "ContentAssets_userId_idx" ON "ContentAssets"("userId");

-- CreateIndex
CREATE INDEX "ContentAssets_scriptId_idx" ON "ContentAssets"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "SEOScorecard_scriptId_key" ON "SEOScorecard"("scriptId");

-- CreateIndex
CREATE INDEX "SEOScorecard_userId_idx" ON "SEOScorecard"("userId");

-- CreateIndex
CREATE INDEX "SEOScorecard_scriptId_idx" ON "SEOScorecard"("scriptId");
