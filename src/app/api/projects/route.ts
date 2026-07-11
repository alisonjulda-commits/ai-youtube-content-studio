import { createProject, listProjects, searchProjects } from '@/lib/project-manager';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const body = await request.json();

    const { title, description, status, priority, dueDate, checklistItems } = body;

    const project = await createProject(userId, {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      checklistItems,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create project',
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const query = request.nextUrl.searchParams.get('q');
    const status = request.nextUrl.searchParams.get('status');
    const priority = request.nextUrl.searchParams.get('priority');
    const includeArchived = request.nextUrl.searchParams.get('archived') === 'true';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');

    let projects;

    if (query) {
      projects = await searchProjects(userId, query, includeArchived);
    } else {
      projects = await listProjects(userId, {
        includeArchived,
        limit,
        status: status || undefined,
        priority: priority || undefined,
      });
    }

    return NextResponse.json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error('List projects error:', error);
    return NextResponse.json(
      { error: 'Failed to list projects' },
      { status: 500 }
    );
  }
}
