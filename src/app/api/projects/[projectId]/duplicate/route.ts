import { duplicateProject } from '@/lib/project-manager';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { projectId } = params;
    const body = await request.json();
    const { newTitle } = body;

    const duplicated = await duplicateProject(projectId, userId, newTitle);

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    console.error('Duplicate project error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to duplicate project',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}
