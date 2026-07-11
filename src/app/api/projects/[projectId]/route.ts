import { getProject, updateProject, deleteProject } from '@/lib/project-manager';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { projectId } = params;

    const project = await getProject(projectId, userId);

    return NextResponse.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get project',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { projectId } = params;
    const body = await request.json();

    const { title, description, status, priority, dueDate, checklistItems } = body;

    const updated = await updateProject(projectId, userId, {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      checklistItems,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update project error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update project',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { projectId } = params;

    await deleteProject(projectId, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to delete project',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}
