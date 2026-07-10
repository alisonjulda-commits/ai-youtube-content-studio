'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { CategoryTemplates } from '@/components/category-templates';
import { CATEGORIES, STATUSES } from '@/lib/constants';
import type { VideoIdea } from '@/types';

export default function VideoIdeasPage() {
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<VideoIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    difficulty: 'medium',
    status: 'idea',
  });

  useEffect(() => {
    fetchIdeas();
  }, []);

  const filterIdeas = useCallback(() => {
    let filtered = ideas;

    if (searchTerm) {
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((idea) => idea.category === categoryFilter);
    }

    setFilteredIdeas(filtered);
  }, [ideas, searchTerm, categoryFilter]);

  useEffect(() => {
    filterIdeas();
  }, [filterIdeas]);

  async function fetchIdeas() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/videos', {
        headers: { 'x-user-id': 'default-user' },
      });
      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
      }
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newIdea = await response.json();
        setIdeas([newIdea, ...ideas]);
        setIsModalOpen(false);
        setFormData({
          title: '',
          description: '',
          category: '',
          priority: 'medium',
          difficulty: 'medium',
          status: 'idea',
        });
      }
    } catch (error) {
      console.error('Failed to create idea:', error);
    }
  }

  async function deleteIdea(id: string) {
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      setIdeas(ideas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error('Failed to delete idea:', error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Ideas</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your video content ideas</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Idea
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      {categoryFilter && <CategoryTemplates selectedCategory={categoryFilter} />}

      {filteredIdeas.length === 0 ? (
        <EmptyState
          title={ideas.length === 0 ? 'No video ideas yet' : 'No matching ideas'}
          description={ideas.length === 0 ? 'Create your first video idea to get started' : 'Try adjusting your filters'}
          action={
            ideas.length === 0 ? (
              <Button onClick={() => setIsModalOpen(true)}>Create Idea</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <Card key={idea.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-base line-clamp-2">{idea.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {idea.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{idea.description}</p>}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{idea.category}</Badge>
                  {STATUSES.find((s) => s.value === idea.status) && (
                    <Badge className={`${STATUSES.find((s) => s.value === idea.status)?.color} text-white`}>
                      {STATUSES.find((s) => s.value === idea.status)?.label}
                    </Badge>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteIdea(idea.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen} title="Create New Video Idea">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter video title"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <Select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Idea
            </Button>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
