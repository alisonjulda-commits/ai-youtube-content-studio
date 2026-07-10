import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.prompt.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete prompt:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const prompt = await db.prompt.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Failed to update prompt:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
