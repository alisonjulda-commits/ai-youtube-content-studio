'use client';

import { useState } from 'react';
import { Copy, Check, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { copyToClipboard } from '@/lib/utils';

interface SEOResult {
  titles: string[];
  descriptions: string[];
  hashtags: string[];
  ctrScore: number;
  seoScore: number;
}

export default function SEOGeneratorPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
  });
  const [result, setResult] = useState<SEOResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Failed to generate SEO data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function copyItem(text: string, id: string) {
    await copyToClipboard(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">SEO Generator</h1>
        <p className="text-muted-foreground mt-1">Optimize your content for YouTube search with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Content Info</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Video Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Current or proposed video title"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Video description or summary"
                    className="min-h-24"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Keywords</label>
                  <Input
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="Comma-separated keywords"
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full gap-2">
                  <Wand2 className="w-4 h-4" />
                  {isLoading ? 'Generating...' : 'Generate Optimization'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          {result && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">SEO Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-muted-foreground text-sm">CTR Score</div>
                      <div className="text-3xl font-bold text-blue-500">{result.ctrScore}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">SEO Score</div>
                      <div className="text-3xl font-bold text-green-500">{result.seoScore}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Titles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.titles.map((title, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 p-2 rounded border border-border">
                      <p className="text-sm flex-1 line-clamp-2">{title}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyItem(title, `title-${i}`)}
                      >
                        {copiedIndex === `title-${i}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Descriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.descriptions.map((desc, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 p-2 rounded border border-border">
                      <p className="text-sm flex-1 line-clamp-2">{desc}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyItem(desc, `desc-${i}`)}
                      >
                        {copiedIndex === `desc-${i}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hashtags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, i) => (
                      <button
                        key={i}
                        onClick={() => copyItem(tag, `tag-${i}`)}
                        className="px-3 py-1 rounded bg-accent text-sm hover:bg-accent/80 transition-colors flex items-center gap-2"
                      >
                        {tag}
                        {copiedIndex === `tag-${i}` ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
