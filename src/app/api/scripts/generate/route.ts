import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateScript } from '@/lib/anthropic';
import { calculateReadingTime, calculateSpeakingTime, wordCount } from '@/lib/utils';

function parseScriptContent(content: string) {
  const sections: {
    hook?: string;
    intro?: string;
    body?: string;
    examples?: string;
    cta?: string;
    outro?: string;
  } = {};

  // Common section markers
  const markers = [
    { regex: /(?:^|\n)\s*(?:\*\*)?Hook(?:\*\*)?:?\s*\n([\s\S]*?)(?=\n\s*(?:\*\*)?(?:Introduction|Intro|Main Content|Body)(?:\*\*)?\s*:|$)/i, key: 'hook' },
    { regex: /(?:^|\n)\s*(?:\*\*)?(?:Introduction|Intro)(?:\*\*)?:?\s*\n([\s\S]*?)(?=\n\s*(?:\*\*)?(?:Main Content|Body)(?:\*\*)?\s*:|$)/i, key: 'intro' },
    { regex: /(?:^|\n)\s*(?:\*\*)?(?:Main Content|Body)(?:\*\*)?:?\s*\n([\s\S]*?)(?=\n\s*(?:\*\*)?(?:Examples|Call to Action|CTA)(?:\*\*)?\s*:|$)/i, key: 'body' },
    { regex: /(?:^|\n)\s*(?:\*\*)?Examples(?:\*\*)?:?\s*\n([\s\S]*?)(?=\n\s*(?:\*\*)?(?:Call to Action|CTA)(?:\*\*)?\s*:|$)/i, key: 'examples' },
    { regex: /(?:^|\n)\s*(?:\*\*)?(?:Call to Action|CTA)(?:\*\*)?:?\s*\n([\s\S]*?)(?=\n\s*(?:\*\*)?Outro(?:\*\*)?\s*:|$)/i, key: 'cta' },
    { regex: /(?:^|\n)\s*(?:\*\*)?Outro(?:\*\*)?:?\s*\n([\s\S]*?)$/i, key: 'outro' },
  ];

  markers.forEach(({ regex, key }) => {
    const match = content.match(regex);
    if (match && match[1]) {
      sections[key as keyof typeof sections] = match[1].trim();
    }
  });

  // If parsing failed, split into sections
  if (Object.keys(sections).length === 0) {
    const parts = content.split(/\n(?:---|\*\*\*|===)\n/);
    sections.hook = parts[0]?.trim() || '';
    sections.intro = parts[1]?.trim() || '';
    sections.body = parts[2]?.trim() || '';
    sections.examples = parts[3]?.trim() || '';
    sections.cta = parts[4]?.trim() || '';
    sections.outro = parts[5]?.trim() || '';
  }

  return sections;
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { topic, targetAudience, duration, tone, title } = await request.json();

    const scriptContent = await generateScript(topic, targetAudience, duration, tone);
    const parsedSections = parseScriptContent(scriptContent);

    const wc = wordCount(scriptContent);
    const rt = calculateReadingTime(scriptContent);
    const st = calculateSpeakingTime(scriptContent);

    const script = await db.script.create({
      data: {
        userId,
        title: title || `${topic} Script`,
        hook: parsedSections.hook || '',
        intro: parsedSections.intro || '',
        body: parsedSections.body || '',
        examples: parsedSections.examples || '',
        cta: parsedSections.cta || '',
        outro: parsedSections.outro || '',
        tone,
        wordCount: wc,
        readingTime: rt,
        speakingTime: st,
      },
    });

    return NextResponse.json(script, { status: 201 });
  } catch (error) {
    console.error('Failed to generate script:', error);
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
  }
}
