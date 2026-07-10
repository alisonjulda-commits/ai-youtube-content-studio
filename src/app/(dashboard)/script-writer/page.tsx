'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Wand2, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { copyToClipboard, calculateSpeakingTime, calculateReadingTime, wordCount } from '@/lib/utils';
import type { Script } from '@/types';

export default function ScriptWriterPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [generationForm, setGenerationForm] = useState({
    title: '',
    topic: '',
    targetAudience: '',
    duration: '5',
    tone: 'informative',
  });

  const fetchScripts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/scripts', {
        headers: { 'x-user-id': 'default-user' },
      });
      if (response.ok) {
        const data = await response.json();
        setScripts(data);
        if (data.length > 0 && !selectedScript) {
          setSelectedScript(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch scripts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedScript]);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  async function handleGenerateScript(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({
          ...generationForm,
          duration: parseInt(generationForm.duration),
        }),
      });

      if (response.ok) {
        const newScript = await response.json();
        setScripts([newScript, ...scripts]);
        setSelectedScript(newScript);
        setIsGenerateOpen(false);
        setGenerationForm({
          title: '',
          topic: '',
          targetAudience: '',
          duration: '5',
          tone: 'informative',
        });
      }
    } catch (error) {
      console.error('Failed to generate script:', error);
    }
  }

  async function updateScript() {
    if (!selectedScript) return;

    try {
      const response = await fetch(`/api/scripts/${selectedScript.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedScript),
      });

      if (response.ok) {
        const updated = await response.json();
        setSelectedScript(updated);
        setScripts(scripts.map((s) => (s.id === updated.id ? updated : s)));
      }
    } catch (error) {
      console.error('Failed to update script:', error);
    }
  }

  async function copyContent() {
    if (!selectedScript) return;
    const content = [
      selectedScript.hook,
      selectedScript.intro,
      selectedScript.body,
      selectedScript.examples,
      selectedScript.cta,
      selectedScript.outro,
    ]
      .filter(Boolean)
      .join('\n\n');

    await copyToClipboard(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Script Writer</h1>
          <p className="text-muted-foreground mt-1">Create and manage video scripts with AI assistance</p>
        </div>
        <Button onClick={() => setIsGenerateOpen(true)} className="gap-2">
          <Wand2 className="w-4 h-4" />
          Generate with AI
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Scripts</h3>
            {scripts.length === 0 ? (
              <EmptyState
                title="No scripts yet"
                description="Generate your first script with AI"
              />
            ) : (
              <div className="space-y-2">
                {scripts.map((script) => (
                  <button
                    key={script.id}
                    onClick={() => setSelectedScript(script)}
                    className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                      selectedScript?.id === script.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="font-medium line-clamp-2">{script.title}</div>
                    <div className="text-xs opacity-75">{script.wordCount} words</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedScript ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedScript.title}</h2>
                <Button variant="outline" size="sm" onClick={copyContent} className="gap-2">
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-muted-foreground">Words</div>
                    <div className="text-2xl font-bold">{selectedScript.wordCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-muted-foreground">Reading</div>
                    <div className="text-2xl font-bold">{selectedScript.readingTime}m</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-muted-foreground">Speaking</div>
                    <div className="text-2xl font-bold">{selectedScript.speakingTime}m</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'hook', label: 'Hook', placeholder: 'Attention-grabbing opening...' },
                  { key: 'intro', label: 'Introduction', placeholder: 'Introduce the topic...' },
                  { key: 'body', label: 'Main Content', placeholder: 'Main points and details...' },
                  { key: 'examples', label: 'Examples', placeholder: 'Real-world examples...' },
                  { key: 'cta', label: 'Call to Action', placeholder: 'What should viewers do?' },
                  { key: 'outro', label: 'Outro', placeholder: 'Closing remarks...' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-sm font-medium">{label}</label>
                    <Textarea
                      value={String(selectedScript[key as keyof Script] || '')}
                      onChange={(e) =>
                        setSelectedScript({
                          ...selectedScript,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={placeholder}
                      className="mt-1 min-h-24"
                    />
                  </div>
                ))}
              </div>

              <Button onClick={updateScript} className="w-full">
                Save Script
              </Button>
            </div>
          ) : (
            <EmptyState
              title="No script selected"
              description="Generate a script or select one from the list to edit"
            />
          )}
        </div>
      </div>

      <Modal
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
        title="Generate Script with AI"
      >
        <form onSubmit={handleGenerateScript} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Script Title</label>
            <Input
              required
              value={generationForm.title}
              onChange={(e) => setGenerationForm({ ...generationForm, title: e.target.value })}
              placeholder="e.g., How to Make Perfect Coffee"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Topic</label>
            <Input
              required
              value={generationForm.topic}
              onChange={(e) => setGenerationForm({ ...generationForm, topic: e.target.value })}
              placeholder="What is your video about?"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Target Audience</label>
            <Input
              value={generationForm.targetAudience}
              onChange={(e) => setGenerationForm({ ...generationForm, targetAudience: e.target.value })}
              placeholder="e.g., Coffee enthusiasts, Beginners"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input
              type="number"
              min="1"
              max="60"
              value={generationForm.duration}
              onChange={(e) => setGenerationForm({ ...generationForm, duration: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tone</label>
            <Select
              value={generationForm.tone}
              onChange={(e) => setGenerationForm({ ...generationForm, tone: e.target.value })}
            >
              <option value="informative">Informative</option>
              <option value="entertaining">Entertaining</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="motivational">Motivational</option>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Generate Script
            </Button>
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
