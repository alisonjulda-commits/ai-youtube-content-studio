'use client';

import { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { copyToClipboard } from '@/lib/utils';

interface ThumbnailPromptGeneratorProps {
  videoTitle?: string;
  topic?: string;
  keywords?: string;
  onGenerate?: (prompt: string) => void;
}

export function ThumbnailPromptGenerator({
  videoTitle: initialTitle = '',
  topic: initialTopic = '',
  keywords: initialKeywords = '',
  onGenerate,
}: ThumbnailPromptGeneratorProps) {
  const [videoTitle, setVideoTitle] = useState(initialTitle);
  const [topic, setTopic] = useState(initialTopic);
  const [keywords, setKeywords] = useState(initialKeywords);
  const [style, setStyle] = useState('modern');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function generatePrompt() {
    if (!videoTitle && !topic) {
      alert('Please enter a video title or topic');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/prompts/thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({ videoTitle, topic, keywords, style }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrompt(data.prompt);
        onGenerate?.(data.prompt);
      }
    } catch (error) {
      console.error('Failed to generate thumbnail prompt:', error);
      alert('Failed to generate thumbnail prompt');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    await copyToClipboard(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🖼️</span> Thumbnail Prompt Generator
          </CardTitle>
          <CardDescription>
            Generate an AI design prompt for your YouTube thumbnail
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Video Title</label>
            <Input
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="e.g., 5 Claude AI Tips You Should Know"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Topic</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., AI Tools, Claude AI, Productivity"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Keywords (optional)</label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., tips, tutorial, AI, productivity"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Style</label>
            <Select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="modern">Modern</option>
              <option value="bold">Bold & Energetic</option>
              <option value="minimal">Minimal</option>
              <option value="colorful">Colorful & Vibrant</option>
              <option value="professional">Professional</option>
              <option value="playful">Playful & Fun</option>
            </Select>
          </div>

          <Button onClick={generatePrompt} disabled={isLoading} className="w-full gap-2">
            <Wand2 className="w-4 h-4" />
            {isLoading ? 'Generating...' : 'Generate Thumbnail Prompt'}
          </Button>
        </CardContent>
      </Card>

      {prompt && (
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Generated Design Prompt</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="gap-2"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-48"
            />
            <p className="text-xs text-muted-foreground mt-3">
              💡 Copy this prompt to Canva AI, Midjourney, or any design tool to create your thumbnail
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
