import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { promptSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = { userId };
    if (category) where.category = category;

    const prompts = await db.prompt.findMany({
      where,
      orderBy: { isFavorite: 'desc' },
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const body = await request.json();

    const validated = promptSchema.parse(body);

    const prompt = await db.prompt.create({
      data: {
        ...validated,
        userId,
      },
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error('Failed to create prompt:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
