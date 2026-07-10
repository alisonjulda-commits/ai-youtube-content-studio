import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateSEOData } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  try {
    const { title, description, keywords, scriptId } = await request.json();

    const seoData = await generateSEOData(title, description, keywords);

    if (scriptId) {
      const created = await db.sEOData.create({
        data: {
          scriptId,
          title: seoData.titles[0],
          description: seoData.descriptions[0],
          keywords: keywords,
          hashtags: seoData.hashtags.join(', '),
          ctrScore: seoData.ctrScore,
          seoScore: seoData.seoScore,
        },
      });

      return NextResponse.json(created, { status: 201 });
    }

    return NextResponse.json(seoData, { status: 201 });
  } catch (error) {
    console.error('Failed to generate SEO data:', error);
    return NextResponse.json({ error: 'Failed to generate SEO data' }, { status: 500 });
  }
}
