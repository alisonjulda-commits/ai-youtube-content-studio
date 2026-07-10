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
