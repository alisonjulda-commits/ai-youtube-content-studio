import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { videoTitle, topic, keywords, style = 'modern' } = await request.json();

    if (!videoTitle && !topic) {
      return NextResponse.json(
        { error: 'Either videoTitle or topic is required' },
        { status: 400 }
      );
    }

    const prompt = `Generate a detailed Canva/design prompt for a YouTube thumbnail with these specs:
Title: ${videoTitle || topic}
Topic: ${topic || videoTitle}
Keywords: ${keywords || 'not specified'}
Style: ${style}

Create a prompt that a designer or AI image generator can use to create an eye-catching YouTube thumbnail.
Include:
1. Main visual elements (colors, shapes, images)
2. Text placement and font suggestions
3. Emotional tone/vibe
4. Design principles to follow
5. What to avoid

Make it specific and actionable for a ${style} style thumbnail.

Format as a complete design brief that can be copied directly to Canva AI or similar tools.`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const thumbnailPrompt = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({
      prompt: thumbnailPrompt,
      videoTitle,
      topic,
      keywords,
      style,
    });
  } catch (error) {
    console.error('Failed to generate thumbnail prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail prompt' },
      { status: 500 }
    );
  }
}
