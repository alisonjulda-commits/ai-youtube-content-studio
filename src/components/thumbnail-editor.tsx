'use client';

import { useState, useEffect } from 'react';
import { Save, Download, Eye, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ThumbnailEditorProps {
  videoIdeaId?: string;
  onSave?: (designId: string) => void;
  onExport?: (svgUrl: string) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultColors: {
    background: string;
    text: string;
    accent: string;
  };
}

interface Design {
  templateId: string;
  title: string;
  colors: {
    background: string;
    text: string;
    accent: string;
  };
  textOverrides: Record<string, string>;
}

export function ThumbnailEditor({ videoIdeaId, onSave, onExport }: ThumbnailEditorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [design, setDesign] = useState<Design>({
    templateId: '',
    title: 'New Thumbnail',
    colors: {
      background: '#1a1a2e',
      text: '#ffffff',
      accent: '#00d4ff',
    },
    textOverrides: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch('/api/thumbnails/templates', {
        headers: { 'x-user-id': 'default-user' },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
        if (data.templates.length > 0) {
          selectTemplate(data.templates[0]);
        }
      }
    } catch (err) {
      setError('Failed to load templates');
      console.error(err);
    }
  }

  function selectTemplate(template: Template) {
    setSelectedTemplate(template);
    setDesign((prev) => ({
      ...prev,
      templateId: template.id,
      colors: {
        ...template.defaultColors,
        ...prev.colors,
      },
    }));
    generatePreview(template.id);
  }

  async function generatePreview(templateId: string) {
    try {
      // For now, we'll use a placeholder preview
      // In production, this would call a server endpoint
      setPreviewUrl(`/api/thumbnails/preview?templateId=${templateId}`);
    } catch (err) {
      console.error('Preview error:', err);
    }
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      setError('');

      const response = await fetch('/api/thumbnails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({
          ...design,
          videoIdeaId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save design');
      }

      const result = await response.json();
      onSave?.(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleExport() {
    if (!selectedTemplate) {
      setError('Please select a template first');
      return;
    }

    try {
      // First save, then export
      if (!design.templateId) {
        await handleSave();
        return;
      }

      // For now, generate SVG client-side
      // The actual export would require server-side rendering
      alert('Export feature coming soon - SVG preview ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thumbnail Designer</h1>
        <p className="text-muted-foreground mt-1">Create eye-catching YouTube thumbnails</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Template Selection */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => selectTemplate(template)}
                className={`w-full p-2 rounded-lg text-left transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <p className="font-medium">{template.name}</p>
                <p className="text-xs opacity-75">{template.category}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Design Editor</CardTitle>
            <CardDescription>Customize your thumbnail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-sm font-medium">Design Title</label>
              <Input
                value={design.title}
                onChange={(e) =>
                  setDesign({ ...design, title: e.target.value })
                }
                placeholder="My awesome thumbnail"
              />
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Colors
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Background</label>
                  <input
                    type="color"
                    value={design.colors.background}
                    onChange={(e) =>
                      setDesign({
                        ...design,
                        colors: { ...design.colors, background: e.target.value },
                      })
                    }
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Text</label>
                  <input
                    type="color"
                    value={design.colors.text}
                    onChange={(e) =>
                      setDesign({
                        ...design,
                        colors: { ...design.colors, text: e.target.value },
                      })
                    }
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Accent</label>
                  <input
                    type="color"
                    value={design.colors.accent}
                    onChange={(e) =>
                      setDesign({
                        ...design,
                        colors: { ...design.colors, accent: e.target.value },
                      })
                    }
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving || !selectedTemplate}
                className="gap-2 flex-1"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Design'}
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary rounded-lg p-4 aspect-video flex items-center justify-center border-2 border-dashed border-muted">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">{selectedTemplate.name}</p>
                <p className="text-sm text-muted-foreground">1280x720 (16:9)</p>
                <p className="text-xs text-muted-foreground mt-2">
                  SVG preview will render here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
