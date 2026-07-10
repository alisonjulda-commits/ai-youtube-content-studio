import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';

    let settings = await db.settings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await db.settings.create({
        data: {
          userId,
          ownerName: 'Julda Marie Alison',
          channelName: 'Julda Marie Alison',
          brandPrimaryColor: '#6366f1',
          brandSecondaryColor: '#ec4899',
          theme: 'system',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const body = await request.json();

    let settings = await db.settings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await db.settings.create({
        data: {
          userId,
          ...body,
        },
      });
    } else {
      settings = await db.settings.update({
        where: { userId },
        data: body,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
