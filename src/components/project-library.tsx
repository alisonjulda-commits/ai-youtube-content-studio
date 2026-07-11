'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Copy,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  checklistItems?: ChecklistItem[];
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectLibraryProps {
  onProjectSelect?: (projectId: string) => void;
}

const statusOptions = ['planning', 'in-progress', 'completed', 'on-hold'];
const priorityOptions = ['low', 'medium', 'high'];

const statusColors: Record<string, string> = {
  planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'in-progress':
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'on-hold': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function ProjectLibrary({ onProjectSelect }: ProjectLibraryProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showNewProject, setShowNewProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState<string | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('planning');
  const [newProjectPriority, setNewProjectPriority] = useState('medium');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError('');

      let url = '/api/projects?limit=100';
      if (showArchived) url += '&archived=true';
      if (filterStatus) url += `&status=${filterStatus}`;
      if (filterPriority) url += `&priority=${filterPriority}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url, {
        headers: { 'x-user-id': 'default-user' },
      });

      if (!response.ok) throw new Error('Failed to load projects');

      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading projects');
    } finally {
      setLoading(false);
    }
  }

  async function createProject() {
    if (!newProjectTitle.trim()) {
      setError('Project title is required');
      return;
    }

    try {
      setError('');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({
          title: newProjectTitle,
          description: newProjectDescription,
          status: newProjectStatus,
          priority: newProjectPriority,
        }),
      });

      if (!response.ok) throw new Error('Failed to create project');

      setNewProjectTitle('');
      setNewProjectDescription('');
      setNewProjectStatus('planning');
      setNewProjectPriority('medium');
      setShowNewProject(false);
      setSuccess('Project created successfully');
      setTimeout(() => setSuccess(''), 3000);
      loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating project');
    }
  }

  async function duplicateProject(projectId: string) {
    try {
      setError('');
      const response = await fetch(`/api/projects/${projectId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error('Failed to duplicate project');

      setSuccess('Project duplicated successfully');
      setTimeout(() => setSuccess(''), 3000);
      loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error duplicating project');
    }
  }

  async function toggleArchive(projectId: string, isArchived: boolean) {
    try {
      setError('');
      const response = await fetch(`/api/projects/${projectId}/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({ restore: isArchived }),
      });

      if (!response.ok) throw new Error('Failed to archive project');

      setSuccess(isArchived ? 'Project restored' : 'Project archived');
      setTimeout(() => setSuccess(''), 3000);
      loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error archiving project');
    }
  }

  async function deleteProject(projectId: string) {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    try {
      setError('');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'default-user' },
      });

      if (!response.ok) throw new Error('Failed to delete project');

      setSuccess('Project deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting project');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Library</h1>
        <p className="text-muted-foreground mt-1">
          Manage and organize your video projects
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 rounded-md text-sm">
          {success}
        </div>
      )}

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  loadProjects();
                }}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowNewProject(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                loadProjects();
              }}
              className="px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                loadProjects();
              }}
              className="px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="">All Priority</option>
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>

            <Button
              onClick={() => {
                setShowArchived(!showArchived);
                loadProjects();
              }}
              variant={showArchived ? 'default' : 'outline'}
              className="gap-2"
            >
              <Archive className="w-4 h-4" />
              {showArchived ? 'Showing' : 'Show'} Archived
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Project Dialog */}
      {showNewProject && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Project name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Project details"
                rows={3}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={newProjectStatus}
                  onChange={(e) => setNewProjectStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={newProjectPriority}
                  onChange={(e) => setNewProjectPriority(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={createProject} className="flex-1">
                Create Project
              </Button>
              <Button
                onClick={() => setShowNewProject(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No projects found. Create one to get started!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onProjectSelect?.(project.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg truncate">
                      {project.title}
                    </CardTitle>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateProject(project.id);
                      }}
                      className="p-1.5 hover:bg-secondary rounded"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive(project.id, !!project.archivedAt);
                      }}
                      className="p-1.5 hover:bg-secondary rounded"
                      title={project.archivedAt ? 'Restore' : 'Archive'}
                    >
                      {project.archivedAt ? (
                        <ArchiveRestore className="w-4 h-4" />
                      ) : (
                        <Archive className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="p-1.5 hover:bg-destructive/10 rounded text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[project.priority]}`}>
                    {project.priority}
                  </span>
                </div>

                {project.checklistItems && project.checklistItems.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {project.checklistItems.filter((i) => i.completed).length} /{' '}
                    {project.checklistItems.length} tasks complete
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Updated{' '}
                  {new Date(project.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
