import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateScript(
  topic: string,
  targetAudience: string,
  duration: number,
  tone: string
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Create a YouTube video script for the following:

Topic: ${topic}
Target Audience: ${targetAudience}
Duration: ${duration} minutes
Tone: ${tone}

Please structure the script with clear sections: Hook, Introduction, Main Content, Call to Action, and Outro.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Unexpected response format');
}

export async function generateSEOData(
  title: string,
  description: string,
  keywords: string
): Promise<{
  titles: string[];
  descriptions: string[];
  hashtags: string[];
  ctrScore: number;
  seoScore: number;
}> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `Optimize this YouTube content for SEO:

Title: ${title}
Description: ${description}
Keywords: ${keywords}

Please provide:
1. 5 optimized titles (50-60 chars each)
2. 3 optimized descriptions (155-160 chars each)
3. 15 relevant hashtags
4. A CTR score (0-100) based on title quality
5. An SEO score (0-100) based on overall optimization

Format the response as JSON.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse SEO response:', e);
    }
  }

  return {
    titles: [title],
    descriptions: [description],
    hashtags: keywords.split(',').map((k) => `#${k.trim()}`),
    ctrScore: 50,
    seoScore: 50,
  };
}

export async function generateThumbnailPrompt(topic: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Create a detailed prompt for AI image generation of a YouTube thumbnail for a video about: ${topic}

The thumbnail should be eye-catching, clear, and follow YouTube best practices. Include specific details about composition, colors, text, and design elements.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Unexpected response format');
}

export async function generateShorts(topic: string, duration: number): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `Create 5 YouTube Shorts scripts based on this topic: ${topic}

Each short should be ${duration} seconds or less (~40-50 words). Make them engaging, with clear hooks and call-to-actions.

Format as a JSON array of strings.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse Shorts response:', e);
    }
  }

  return [];
}

export async function generateVideoTitles(
  scriptTitle: string,
  topic: string
): Promise<{ text: string; score: number }[]> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `Generate 20 YouTube video titles for a video about: ${topic}
Original title: ${scriptTitle}

Requirements:
- 50-60 characters each
- Include power words (how, why, best, secret, etc)
- Make them clickable and benefit-driven
- Vary the approach (listicles, how-tos, comparisons, etc)

Score each title from 1-100 based on:
- CTR potential
- SEO friendliness
- Clarity
- Emotional impact

Format as JSON:
[{"text": "title", "score": 85}, ...]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse titles:', e);
    }
  }

  return [];
}

export async function generateVideoDescription(
  scriptTitle: string,
  topic: string,
  keywords: string[]
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Create an SEO-optimized YouTube video description for:
Title: ${scriptTitle}
Topic: ${topic}
Keywords: ${keywords.join(', ')}

Requirements:
- 155-160 characters (optimal for YouTube)
- Include primary keyword in first sentence
- Include call-to-action
- Make it compelling and clickable
- Natural language (not keyword stuffing)`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Failed to generate description');
}

export async function generateVideoChapters(scriptContent: string): Promise<{ timestamp: string; title: string }[]> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Create YouTube chapters/timestamps for this 5-minute video script:

${scriptContent}

Requirements:
- Start with 0:00 Introduction
- Create 4-6 main chapters
- Use MM:SS format
- Make chapter titles descriptive and searchable
- Estimate realistic timestamps for 5-minute video

Format as JSON:
[{"timestamp": "0:00", "title": "Introduction"}, ...]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse chapters:', e);
    }
  }

  return [];
}

export async function generateVideoTags(topic: string, keywords: string[]): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Generate 30 YouTube video tags for a video about: ${topic}
Primary keywords: ${keywords.join(', ')}

Requirements:
- Mix of high volume and long-tail keywords
- Include both specific and broad terms
- Include related searches
- Avoid duplicate tags

Format as JSON array: ["tag1", "tag2", ...]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse tags:', e);
    }
  }

  return [];
}

export async function generateHashtags(topic: string): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Generate 15-20 relevant hashtags for a YouTube video about: ${topic}

Include:
- Trending hashtags (#shorts, #viral, etc)
- Niche hashtags
- Community hashtags
- Mix of high and low volume

Format as JSON array: ["#hashtag1", "#hashtag2", ...]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse hashtags:', e);
    }
  }

  return [];
}

export async function generateKeywordAnalysis(
  scriptTitle: string,
  scriptContent: string,
  topic: string
): Promise<{
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  searchCompetition: number;
}> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Analyze keywords for a YouTube video:
Title: ${scriptTitle}
Topic: ${topic}
Content excerpt: ${scriptContent.substring(0, 500)}

Identify:
1. Primary keyword (most important, highest search volume)
2. 5-8 secondary keywords (related, medium search volume)
3. 5-8 long-tail keywords (specific phrases, lower competition)
4. Estimate search competition (1-100, where 100 is most competitive)

Format as JSON:
{
  "primaryKeyword": "string",
  "secondaryKeywords": ["keyword1", ...],
  "longTailKeywords": ["long tail phrase 1", ...],
  "searchCompetition": 65
}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse keywords:', e);
    }
  }

  return {
    primaryKeyword: topic,
    secondaryKeywords: [],
    longTailKeywords: [],
    searchCompetition: 50,
  };
}

export async function generateThumbnailTexts(scriptTitle: string, topic: string): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Generate 5 thumbnail text variations for a YouTube video:
Title: ${scriptTitle}
Topic: ${topic}

Requirements:
- 2-5 words each
- High contrast, bold text
- Benefit-driven (numbers, power words)
- Emoji-compatible

Examples: "5 SECRETS", "FREE MONEY", "REVEALED!"

Format as JSON array: ["text1", "text2", ...]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse thumbnail texts:', e);
    }
  }

  return [];
}

export async function generateHookVariations(scriptHook: string): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `Generate 10 different hook variations for a YouTube video.
Original hook: ${scriptHook}

Requirements:
- Each 20-50 words
- Different angles (question, statement, curiosity gap, shock value, etc)
- Test-worthy variations for A/B testing
- All designed to hook in first 3 seconds

Format as JSON array: ["hook1", "hook2", ...]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse hook variations:', e);
    }
  }

  return [];
}

export async function generatePinnedComments(scriptContent: string, topic: string): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `Generate 5 pinned comment ideas for a YouTube video about: ${topic}

Requirements:
- 1-2 sentences each
- Encourage discussion/engagement
- Include call-to-action
- Mix of questions and statements
- Professional but relatable tone

Examples of good pinned comments:
"Drop a 🙌 if this helped you!"
"What's your biggest takeaway? Comment below!"

Format as JSON array: ["comment1", ...]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse pinned comments:', e);
    }
  }

  return [];
}

export async function generateCommunityPosts(scriptTitle: string, topic: string): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `Generate 5 YouTube Community post ideas for a channel about: ${topic}
Related to video: ${scriptTitle}

Requirements:
- 50-150 characters each
- Drive traffic to the video
- Encourage engagement
- Use emojis
- Different formats (poll teasers, questions, announcements)

Format as JSON array: ["post1", ...]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse community posts:', e);
    }
  }

  return [];
}

export async function generateBlogArticle(scriptContent: string, scriptTitle: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Convert this video script into a blog article:

Title: ${scriptTitle}

Script:
${scriptContent}

Requirements:
- 1000-1500 words
- SEO-optimized (headers, subheaders)
- Include a call-to-action
- Professional blog format
- Add intro and conclusion
- Make it scannable with bullet points`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Failed to generate blog article');
}

export async function generateLinkedInPost(scriptContent: string, scriptTitle: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Create a LinkedIn post based on this video:

Title: ${scriptTitle}

Script excerpt: ${scriptContent.substring(0, 300)}

Requirements:
- 150-300 words
- Professional tone
- Include key insights
- Call-to-action to watch video
- Use line breaks for readability
- Hashtags at end`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Failed to generate LinkedIn post');
}

export async function generateFacebookPost(scriptContent: string, scriptTitle: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Create a Facebook post based on this video:

Title: ${scriptTitle}

Script excerpt: ${scriptContent.substring(0, 300)}

Requirements:
- 100-200 words
- Conversational, engaging tone
- Include emoji where appropriate
- Clear call-to-action
- Make people want to click`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  throw new Error('Failed to generate Facebook post');
}
