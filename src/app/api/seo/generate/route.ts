import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  generateVideoTitles,
  generateVideoDescription,
  generateVideoChapters,
  generateVideoTags,
  generateHashtags,
  generateKeywordAnalysis,
  generateThumbnailTexts,
  generateHookVariations,
  generatePinnedComments,
  generateCommunityPosts,
  generateShorts,
  generateBlogArticle,
  generateLinkedInPost,
  generateFacebookPost,
} from '@/lib/anthropic';

function calculateSEOScores(
  title: string,
  description: string,
  tags: string[],
  keywords: { primaryKeyword: string; secondaryKeywords: string[] },
  scriptContent: string
) {
  const keywordMatches =
    (title.toLowerCase().includes(keywords.primaryKeyword.toLowerCase()) ? 20 : 0) +
    (description.toLowerCase().includes(keywords.primaryKeyword.toLowerCase()) ? 20 : 0) +
    (tags.some((t) => t.toLowerCase().includes(keywords.primaryKeyword.toLowerCase())) ? 20 : 0) +
    (scriptContent.toLowerCase().includes(keywords.primaryKeyword.toLowerCase()) ? 20 : 0);

  const powerWords = ['secret', 'revealed', 'how to', 'why', 'best', 'amazing', 'shocking'];
  const hasPowerWord = powerWords.some((w) => title.toLowerCase().includes(w));
  const ctpScore = title.length > 40 && title.length < 65 && hasPowerWord ? 85 : 65;

  const hasQuestion = title.includes('?') || description.includes('?');
  const intentScore = hasQuestion ? 75 : 60;

  const avgWordLength =
    scriptContent.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / scriptContent.split(/\s+/).length;
  const readabilityScore = avgWordLength > 4 && avgWordLength < 6 ? 80 : 70;

  const engagementKeywords = ['comment', 'like', 'subscribe', 'share', 'click'];
  const hasEngagementCall = engagementKeywords.some((k) => scriptContent.toLowerCase().includes(k));
  const engagementScore = hasEngagementCall ? 80 : 60;

  const overallScore = Math.round((keywordMatches + ctpScore + intentScore + readabilityScore + engagementScore) / 5);

  return {
    keywordOptimization: keywordMatches,
    ctrPotential: ctpScore,
    searchIntentMatch: intentScore,
    readability: readabilityScore,
    engagementPotential: engagementScore,
    overallScore: Math.min(100, overallScore),
  };
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { scriptId } = await request.json();

    if (!scriptId) {
      return NextResponse.json({ error: 'Script ID required' }, { status: 400 });
    }

    const script = await db.script.findUnique({ where: { id: scriptId } });
    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    const fullScriptContent = [script.hook, script.intro, script.body, script.examples, script.cta, script.outro]
      .filter(Boolean)
      .join('\n\n');

    console.log('Generating titles...');
    const titlesData = await generateVideoTitles(script.title, script.title);
    const titles = titlesData.length > 0 ? titlesData : [{ text: script.title, score: 75 }];
    const bestTitle = titles.length > 0 ? titles.reduce((a, b) => (a.score > b.score ? a : b)).text : script.title;

    console.log('Generating description...');
    const description = await generateVideoDescription(script.title, script.title, []);

    console.log('Generating chapters...');
    const chaptersData = await generateVideoChapters(fullScriptContent);

    console.log('Generating tags...');
    const tagsData = await generateVideoTags(script.title, []);

    console.log('Generating hashtags...');
    const hashtagsData = await generateHashtags(script.title);

    console.log('Generating keywords...');
    const keywordsData = await generateKeywordAnalysis(script.title, fullScriptContent, script.title);

    console.log('Generating thumbnail texts...');
    const thumbnailTexts = await generateThumbnailTexts(script.title, script.title);

    console.log('Generating hook variations...');
    const hookVariations = await generateHookVariations(script.hook || '');

    console.log('Generating pinned comments...');
    const pinnedComments = await generatePinnedComments(fullScriptContent, script.title);

    console.log('Generating community posts...');
    const communityPosts = await generateCommunityPosts(script.title, script.title);

    console.log('Generating YouTube Shorts...');
    const youtubeShorts = await generateShorts(script.title, 60);

    console.log('Generating blog article...');
    const blogArticle = await generateBlogArticle(fullScriptContent, script.title);

    console.log('Generating LinkedIn post...');
    const linkedInPost = await generateLinkedInPost(fullScriptContent, script.title);

    console.log('Generating Facebook post...');
    const facebookPost = await generateFacebookPost(fullScriptContent, script.title);

    const scores = calculateSEOScores(bestTitle, description, tagsData, keywordsData, fullScriptContent);

    console.log('Saving to database...');

    await db.sEOTitles.upsert({
      where: { scriptId },
      update: {
        titles: JSON.stringify(titles),
        selectedTitle: bestTitle,
        ctrScore: Math.max(...titles.map((t) => t.score)),
      },
      create: {
        userId,
        scriptId,
        titles: JSON.stringify(titles),
        selectedTitle: bestTitle,
        ctrScore: Math.max(...titles.map((t) => t.score)),
      },
    });

    await db.sEODescriptions.upsert({
      where: { scriptId },
      update: {
        descriptions: JSON.stringify([description]),
        selectedDescription: description,
      },
      create: {
        userId,
        scriptId,
        descriptions: JSON.stringify([description]),
        selectedDescription: description,
      },
    });

    await db.sEOChapters.upsert({
      where: { scriptId },
      update: { chapters: JSON.stringify(chaptersData) },
      create: {
        userId,
        scriptId,
        chapters: JSON.stringify(chaptersData),
      },
    });

    await db.sEOTags.upsert({
      where: { scriptId },
      update: { tags: JSON.stringify(tagsData) },
      create: {
        userId,
        scriptId,
        tags: JSON.stringify(tagsData),
      },
    });

    await db.sEOHashtags.upsert({
      where: { scriptId },
      update: { hashtags: JSON.stringify(hashtagsData) },
      create: {
        userId,
        scriptId,
        hashtags: JSON.stringify(hashtagsData),
      },
    });

    await db.sEOKeywords.upsert({
      where: { scriptId },
      update: {
        primaryKeyword: keywordsData.primaryKeyword,
        secondaryKeywords: JSON.stringify(keywordsData.secondaryKeywords),
        longTailKeywords: JSON.stringify(keywordsData.longTailKeywords),
        searchCompetition: keywordsData.searchCompetition,
      },
      create: {
        userId,
        scriptId,
        primaryKeyword: keywordsData.primaryKeyword,
        secondaryKeywords: JSON.stringify(keywordsData.secondaryKeywords),
        longTailKeywords: JSON.stringify(keywordsData.longTailKeywords),
        searchCompetition: keywordsData.searchCompetition,
      },
    });

    await db.contentAssets.upsert({
      where: { scriptId },
      update: {
        thumbnailTexts: JSON.stringify(thumbnailTexts),
        hookVariations: JSON.stringify(hookVariations),
        pinnedComments: JSON.stringify(pinnedComments),
        communityPosts: JSON.stringify(communityPosts),
        youtubeShorts: JSON.stringify(youtubeShorts),
        blogArticle,
        linkedInPost,
        facebookPost,
      },
      create: {
        userId,
        scriptId,
        thumbnailTexts: JSON.stringify(thumbnailTexts),
        hookVariations: JSON.stringify(hookVariations),
        pinnedComments: JSON.stringify(pinnedComments),
        communityPosts: JSON.stringify(communityPosts),
        youtubeShorts: JSON.stringify(youtubeShorts),
        blogArticle,
        linkedInPost,
        facebookPost,
      },
    });

    const recommendations = [];
    if (scores.keywordOptimization < 70) recommendations.push('Optimize primary keyword in title and description');
    if (scores.ctrPotential < 70) recommendations.push('Add power words to title for higher click-through rate');
    if (scores.searchIntentMatch < 70) recommendations.push('Consider rephrasing to better match search intent');
    if (scores.readability < 70) recommendations.push('Simplify language and shorten sentences');
    if (scores.engagementPotential < 70) recommendations.push('Add more clear calls-to-action');

    await db.sEOScorecard.upsert({
      where: { scriptId },
      update: {
        keywordOptimization: scores.keywordOptimization,
        ctrPotential: scores.ctrPotential,
        searchIntentMatch: scores.searchIntentMatch,
        readability: scores.readability,
        engagementPotential: scores.engagementPotential,
        overallScore: scores.overallScore,
        recommendations: JSON.stringify(recommendations),
      },
      create: {
        userId,
        scriptId,
        keywordOptimization: scores.keywordOptimization,
        ctrPotential: scores.ctrPotential,
        searchIntentMatch: scores.searchIntentMatch,
        readability: scores.readability,
        engagementPotential: scores.engagementPotential,
        overallScore: scores.overallScore,
        recommendations: JSON.stringify(recommendations),
      },
    });

    return NextResponse.json({
      status: 'success',
      titles,
      bestTitle,
      description,
      chapters: chaptersData,
      tags: tagsData,
      hashtags: hashtagsData,
      keywords: keywordsData,
      scores,
      message: 'All SEO assets generated successfully',
    });
  } catch (error) {
    console.error('Failed to generate SEO data:', error);
    return NextResponse.json({ error: 'Failed to generate SEO data' }, { status: 500 });
  }
}
