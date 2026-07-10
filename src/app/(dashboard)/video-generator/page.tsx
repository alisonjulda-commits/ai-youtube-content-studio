'use client';

import { useState, useEffect } from 'react';
import { Film, PlayCircle, DownloadCloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import type { Script } from '@/types';

interface VideoGenerationJob {
  videoId: string;
  scriptId: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  voiceoverUrls: Record<string, string>;
  totalSeconds: number;
  downloadUrl?: string;
}

export default function VideoGeneratorPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationJobs, setGenerationJobs] = useState<VideoGenerationJob[]>([]);
  const [selectedScriptData, setSelectedScriptData] = useState<Script | null>(null);

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
      }
    } catch (error) {
      console.error('Failed to fetch scripts:', error);
    }
  }

  async function handleGenerateVideo() {
    if (!selectedScript || !selectedScriptData) return;

    setIsLoading(true);
    try {
      const sections = [
        { id: 'hook', text: selectedScriptData.hook || '' },
        { id: 'intro', text: selectedScriptData.intro || '' },
        { id: 'body', text: selectedScriptData.body || '' },
        { id: 'examples', text: selectedScriptData.examples || '' },
        { id: 'cta', text: selectedScriptData.cta || '' },
        { id: 'outro', text: selectedScriptData.outro || '' },
      ].filter((s) => s.text.trim());

      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({
          scriptId: selectedScript,
          title: selectedScriptData.title,
          sections,
        }),
      });

      if (response.ok) {
        const job = await response.json();
        setGenerationJobs([job, ...generationJobs]);
      }
    } catch (error) {
      console.error('Failed to generate video:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Generator</h1>
          <p className="text-muted-foreground mt-1">
            Generate videos from your scripts with AI voiceover and music
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Create Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Script</label>
              <Select
                value={selectedScript}
                onChange={(e) => {
                  const script = scripts.find((s) => s.id === e.target.value);
                  setSelectedScript(e.target.value);
                  setSelectedScriptData(script || null);
                }}
              >
                <option value="">Choose a script...</option>
                {scripts.map((script) => (
                  <option key={script.id} value={script.id}>
                    {script.title}
                  </option>
                ))}
              </Select>
            </div>

            {selectedScriptData && (
              <div className="space-y-2 p-3 rounded-lg bg-muted">
                <div className="text-sm">
                  <div className="text-muted-foreground">Word Count</div>
                  <div className="font-semibold">{selectedScriptData.wordCount}</div>
                </div>
                <div className="text-sm">
                  <div className="text-muted-foreground">Speaking Time</div>
                  <div className="font-semibold">{selectedScriptData.speakingTime}m</div>
                </div>
              </div>
            )}

            <Button
              onClick={handleGenerateVideo}
              disabled={!selectedScript || isLoading}
              className="w-full gap-2"
            >
              <Film className="w-4 h-4" />
              {isLoading ? 'Generating...' : 'Generate Video'}
            </Button>

            <p className="text-xs text-muted-foreground">
              Video generation will:
              <br />
              1. Create TTS voiceover from script
              <br />
              2. Sync with background music
              <br />
              3. Render final video composition
            </p>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="lg:col-span-2">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Generation Jobs</h3>
            {generationJobs.length === 0 ? (
              <EmptyState
                icon="🎬"
                title="No videos generated yet"
                description="Select a script and click Generate Video to create your first video"
              />
            ) : (
              <div className="space-y-2">
                {generationJobs.map((job) => (
                  <Card key={job.videoId}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">Video #{job.videoId.slice(0, 8)}</h4>
                            <p className="text-xs text-muted-foreground">
                              {Math.round(job.totalSeconds)}s • {Object.keys(job.voiceoverUrls).length} sections
                            </p>
                          </div>
                          <div className="text-sm font-semibold">
                            {job.status === 'completed' && <span className="text-green-500">✓ Ready</span>}
                            {job.status === 'generating' && <span className="text-blue-500">⏳ {job.progress}%</span>}
                            {job.status === 'failed' && <span className="text-red-500">✗ Error</span>}
                          </div>
                        </div>

                        {job.status === 'generating' && (
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        )}

                        {job.status === 'completed' && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-2">
                              <PlayCircle className="w-3 h-3" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-2">
                              <DownloadCloud className="w-3 h-3" />
                              Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Features</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">🎙️ AI Voiceover</h4>
            <p className="text-xs text-muted-foreground">
              Natural-sounding Filipina voice with perfect English pronunciation using TTS
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">🎵 Background Music</h4>
            <p className="text-xs text-muted-foreground">
              Lo-fi hip-hop inspired instrumental with professional production quality
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">🎬 Auto Rendering</h4>
            <p className="text-xs text-muted-foreground">
              Automatic video composition and rendering with frame-perfect timing
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
