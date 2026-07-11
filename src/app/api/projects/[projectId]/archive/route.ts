import { archiveProject, restoreProject } from '@/lib/project-manager';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { projectId } = params;
    const body = await request.json();
    const { restore } = body;

    const project = restore
      ? await restoreProject(projectId, userId)
      : await archiveProject(projectId, userId);

    return NextResponse.json(project);
  } catch (error) {
    console.error('Archive project error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to archive project',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}
