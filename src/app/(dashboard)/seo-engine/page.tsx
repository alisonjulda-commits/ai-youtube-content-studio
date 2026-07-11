'use client';

import { useState, useEffect } from 'react';
import { Wand2, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { copyToClipboard } from '@/lib/utils';

interface SEOData {
  titles: { text: string; score: number }[];
  bestTitle: string;
  description: string;
  chapters: { timestamp: string; title: string }[];
  tags: string[];
  hashtags: string[];
  keywords: {
    primaryKeyword: string;
    secondaryKeywords: string[];
    longTailKeywords: string[];
    searchCompetition: number;
  };
  scores: {
    keywordOptimization: number;
    ctrPotential: number;
    searchIntentMatch: number;
    readability: number;
    engagementPotential: number;
    overallScore: number;
  };
}

export default function SEOEnginePage() {
  const [scripts, setScripts] = useState<any[]>([]);
  const [selectedScriptId, setSelectedScriptId] = useState('');
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchScripts();
  }, []);

  async function fetchScripts() {
    try {
      const response = await fetch('/api/scripts', {
        headers: { 'x-user-id': 'default-user' },
      });
      if (response.ok) {
        const data = await response.json();
        setScripts(data);
        if (data.length > 0) {
          setSelectedScriptId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch scripts:', error);
    }
  }

  async function generateSEO() {
    if (!selectedScriptId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({ scriptId: selectedScriptId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSeoData(data);
      }
    } catch (error) {
      console.error('Failed to generate SEO:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy(text: string, id: string) {
    await copyToClipboard(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = ['overview', 'titles', 'keywords', 'content', 'social'];
  const tabLabels: Record<string, string> = {
    overview: 'Overview',
    titles: `Titles (${seoData?.titles.length || 20})`,
    keywords: 'Keywords',
    content: 'Content',
    social: 'Social',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Engine</h1>
        <p className="text-muted-foreground mt-1">AI-powered SEO optimization for your videos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate SEO Assets</CardTitle>
          <CardDescription>Select a script and generate all SEO optimization data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Script</label>
            <Select 
              value={selectedScriptId} 
              onChange={(e) => setSelectedScriptId(e.target.value)}
            >
              <option value="">Choose a script...</option>
              {scripts.map((script) => (
                <option key={script.id} value={script.id}>
                  {script.title} ({script.wordCount} words)
                </option>
              ))}
            </Select>
          </div>
          <Button 
            onClick={generateSEO} 
            disabled={!selectedScriptId || isLoading} 
            className="w-full gap-2"
          >
            <Wand2 className="w-4 h-4" />
            {isLoading ? 'Generating SEO Assets...' : 'Generate All SEO Assets'}
          </Button>
        </CardContent>
      </Card>

      {seoData && (
        <>
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SEO Scorecard</span>
                <span className={`text-3xl font-bold ${scoreColor(seoData.scores.overallScore)}`}>
                  {seoData.scores.overallScore}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Keyword Optimization</p>
                  <p className={`text-2xl font-bold ${scoreColor(seoData.scores.keywordOptimization)}`}>
                    {seoData.scores.keywordOptimization}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">CTR Potential</p>
                  <p className={`text-2xl font-bold ${scoreColor(seoData.scores.ctrPotential)}`}>
                    {seoData.scores.ctrPotential}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Search Intent</p>
                  <p className={`text-2xl font-bold ${scoreColor(seoData.scores.searchIntentMatch)}`}>
                    {seoData.scores.searchIntentMatch}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Readability</p>
                  <p className={`text-2xl font-bold ${scoreColor(seoData.scores.readability)}`}>
                    {seoData.scores.readability}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className={`text-2xl font-bold ${scoreColor(seoData.scores.engagementPotential)}`}>
                    {seoData.scores.engagementPotential}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  onClick={() => setActiveTab(tab)}
                  isActive={activeTab === tab}
                >
                  {tabLabels[tab]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" activeValue={activeTab} className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Best Title</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-lg font-semibold">{seoData.bestTitle}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(seoData.bestTitle, 'title')}
                    className="gap-2"
                  >
                    {isCopied === 'title' ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed">{seoData.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(seoData.description, 'desc')}
                    className="gap-2"
                  >
                    {isCopied === 'desc' ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chapters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {seoData.chapters.map((chapter, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        <span className="font-mono text-muted-foreground">{chapter.timestamp}</span>
                        <span>{chapter.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="titles" activeValue={activeTab} className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>20 Title Options</CardTitle>
                  <CardDescription>Ranked by CTR score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {seoData.titles.map((title, idx) => (
                      <div key={idx} className="flex justify-between items-start p-2 rounded-lg hover:bg-accent">
                        <div className="flex-1">
                          <p className="font-medium">{title.text}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-sm font-bold text-primary">{title.score}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(title.text, `title-${idx}`)}
                          >
                            {isCopied === `title-${idx}` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" activeValue={activeTab} className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Primary Keyword</h4>
                    <p className="text-lg text-primary">{seoData.keywords.primaryKeyword}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Secondary Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {seoData.keywords.secondaryKeywords.map((kw, idx) => (
                        <span key={idx} className="px-3 py-1 bg-secondary/20 rounded-full text-sm">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Long-Tail Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {seoData.keywords.longTailKeywords.map((kw, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Search Competition</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${seoData.keywords.searchCompetition}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{seoData.keywords.searchCompetition}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">Tags</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {seoData.tags.slice(0, 5).map((tag, idx) => (
                            <span key={idx} className="text-xs bg-primary/20 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {seoData.tags.length > 5 && (
                            <span className="text-xs text-muted-foreground">+{seoData.tags.length - 5} more</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">Hashtags</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {seoData.hashtags.slice(0, 5).map((tag, idx) => (
                            <span key={idx} className="text-xs bg-secondary/20 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {seoData.hashtags.length > 5 && (
                            <span className="text-xs text-muted-foreground">+{seoData.hashtags.length - 5} more</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" activeValue={activeTab} className="space-y-4 mt-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Blog Article Generated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">1000-1500 words SEO-optimized article</p>
                    <Button size="sm" variant="outline">
                      View Blog Article
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">YouTube Shorts Ideas (5)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Reusable scripts for short-form content</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Thumbnail Text Variations (5)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Bold, clickable thumbnail text options</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Hook Variations (10)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">A/B test different hook angles</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="social" activeValue={activeTab} className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">LinkedIn Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Professional social post</p>
                  <Button size="sm" variant="outline">
                    View Post
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Facebook Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Engaging social media post</p>
                  <Button size="sm" variant="outline">
                    View Post
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pinned Comments (5)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Engagement-driving pinned comments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Community Posts (5)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Drive traffic via YouTube Community</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {!seoData && selectedScriptId && (
        <Card className="flex items-center gap-3 p-6 bg-blue-50 border-blue-200">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-900">No SEO data generated yet</p>
            <p className="text-sm text-blue-800">Click the Generate button to create comprehensive optimization data</p>
          </div>
        </Card>
      )}
    </div>
  );
}
