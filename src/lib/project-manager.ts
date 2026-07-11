import { db } from './db';

export interface ProjectData {
  title: string;
  description?: string;
  status?: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  checklistItems?: Array<{ id: string; text: string; completed: boolean }>;
}

export interface Project extends ProjectData {
  id: string;
  userId: string;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Create a new project
export async function createProject(userId: string, data: ProjectData): Promise<Project> {
  if (!data.title || data.title.trim().length === 0) {
    throw new Error('Project title is required');
  }

  const project = await db.project.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      status: data.status || 'planning',
      priority: data.priority || 'medium',
      dueDate: data.dueDate,
      checklistItems: data.checklistItems
        ? JSON.stringify(data.checklistItems)
        : null,
    },
  });

  return formatProject(project);
}

// Get a single project
export async function getProject(projectId: string, userId: string): Promise<Project> {
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return formatProject(project);
}

// List all projects for a user (active only by default)
export async function listProjects(
  userId: string,
  options: {
    includeArchived?: boolean;
    limit?: number;
    status?: string;
    priority?: string;
  } = {}
): Promise<Project[]> {
  const { includeArchived = false, limit = 50, status, priority } = options;

  const where: Record<string, any> = {
    userId,
  };

  if (!includeArchived) {
    where.archivedAt = null;
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  const projects = await db.project.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return projects.map(formatProject);
}

// Search projects by title or description
export async function searchProjects(
  userId: string,
  query: string,
  includeArchived = false
): Promise<Project[]> {
  const projects = await db.project.findMany({
    where: {
      userId,
      archivedAt: includeArchived ? undefined : null,
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    },
    orderBy: { updatedAt: 'desc' },
  });

  return projects.map(formatProject);
}

// Update a project
export async function updateProject(
  projectId: string,
  userId: string,
  updates: Partial<ProjectData>
): Promise<Project> {
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const updated = await db.project.update({
    where: { id: projectId },
    data: {
      title: updates.title !== undefined ? updates.title : project.title,
      description:
        updates.description !== undefined ? updates.description : project.description,
      status: updates.status !== undefined ? updates.status : project.status,
      priority: updates.priority !== undefined ? updates.priority : project.priority,
      dueDate: updates.dueDate !== undefined ? updates.dueDate : project.dueDate,
      checklistItems: updates.checklistItems
        ? JSON.stringify(updates.checklistItems)
        : project.checklistItems,
    },
  });

  return formatProject(updated);
}

// Archive a project (soft delete)
export async function archiveProject(projectId: string, userId: string): Promise<Project> {
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const updated = await db.project.update({
    where: { id: projectId },
    data: { archivedAt: new Date() },
  });

  return formatProject(updated);
}

// Restore an archived project
export async function restoreProject(projectId: string, userId: string): Promise<Project> {
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const updated = await db.project.update({
    where: { id: projectId },
    data: { archivedAt: null },
  });

  return formatProject(updated);
}

// Duplicate a project
export async function duplicateProject(
  projectId: string,
  userId: string,
  newTitle?: string
): Promise<Project> {
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const duplicated = await db.project.create({
    data: {
      userId,
      title: newTitle || `${project.title} (Copy)`,
      description: project.description,
      status: project.status,
      priority: project.priority,
      dueDate: project.dueDate,
      checklistItems: project.checklistItems,
    },
  });

  return formatProject(duplicated);
}

// Delete a project permanently
export async function deleteProject(projectId: string, userId: string): Promise<void> {
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await db.project.delete({
    where: { id: projectId },
  });
}

// Get project statistics for user
export async function getProjectStats(userId: string): Promise<{
  total: number;
  active: number;
  archived: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}> {
  const projects = await db.project.findMany({
    where: { userId },
  });

  const active = projects.filter((p) => !p.archivedAt).length;
  const archived = projects.filter((p) => p.archivedAt).length;

  const byStatus: Record<string, number> = {};
  const byPriority: Record<string, number> = {};

  for (const project of projects) {
    if (!project.archivedAt) {
      byStatus[project.status] = (byStatus[project.status] || 0) + 1;
      byPriority[project.priority] = (byPriority[project.priority] || 0) + 1;
    }
  }

  return {
    total: projects.length,
    active,
    archived,
    byStatus,
    byPriority,
  };
}

// Helper function to format project data
function formatProject(project: any): Project {
  return {
    id: project.id,
    userId: project.userId,
    title: project.title,
    description: project.description,
    status: project.status,
    priority: project.priority,
    dueDate: project.dueDate,
    checklistItems: project.checklistItems ? JSON.parse(project.checklistItems) : undefined,
    archivedAt: project.archivedAt,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}
