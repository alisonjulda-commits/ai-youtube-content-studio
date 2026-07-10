'use client';

import { useState, useEffect } from 'react';
import { Plus, Star, Trash2, Copy, Check, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { PROMPT_CATEGORIES } from '@/lib/constants';
import { copyToClipboard } from '@/lib/utils';
import type { Prompt } from '@/types';

export default function PromptLibraryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  useEffect(() => {
    filterPrompts();
  }, [prompts, searchTerm, categoryFilter]);

  async function fetchPrompts() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/prompts', {
        headers: { 'x-user-id': 'default-user' },
      });
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function filterPrompts() {
    let filtered = prompts;

    if (searchTerm) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((prompt) => prompt.category === categoryFilter);
    }

    setFilteredPrompts(filtered);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newPrompt = await response.json();
        setPrompts([newPrompt, ...prompts]);
        setIsModalOpen(false);
        setFormData({ title: '', content: '', category: '' });
      }
    } catch (error) {
      console.error('Failed to create prompt:', error);
    }
  }

  async function toggleFavorite(prompt: Prompt) {
    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !prompt.isFavorite }),
      });

      if (response.ok) {
        const updated = await response.json();
        setPrompts(prompts.map((p) => (p.id === updated.id ? updated : p)));
      }
    } catch (error) {
      console.error('Failed to update prompt:', error);
    }
  }

  async function deletePrompt(id: string) {
    try {
      await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      setPrompts(prompts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete prompt:', error);
    }
  }

  async function copyPrompt(content: string, id: string) {
    await copyToClipboard(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prompt Library</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your AI prompts</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Prompt
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {PROMPT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      {filteredPrompts.length === 0 ? (
        <EmptyState
          title={prompts.length === 0 ? 'No prompts yet' : 'No matching prompts'}
          description={prompts.length === 0 ? 'Create your first prompt to get started' : 'Try adjusting your filters'}
          action={
            prompts.length === 0 ? (
              <Button onClick={() => setIsModalOpen(true)}>Create Prompt</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-2">{prompt.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{prompt.content}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {prompt.category} • Used {prompt.usageCount} times
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(prompt)}
                    >
                      <Star
                        className="w-4 h-4"
                        fill={prompt.isFavorite ? 'currentColor' : 'none'}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyPrompt(prompt.content, prompt.id)}
                    >
                      {copiedId === prompt.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePrompt(prompt.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen} title="Create New Prompt">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Video Title Generator"
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
              {PROMPT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Prompt Content</label>
            <Textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter your prompt template..."
              className="min-h-32"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Prompt
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
