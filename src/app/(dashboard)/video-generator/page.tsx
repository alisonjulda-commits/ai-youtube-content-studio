'use client';

import { useState, useEffect } from 'react';
import { Film, PlayCircle, DownloadCloud, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import type { Script } from '@/types';

const CONTENT_CATEGORIES = [
  { id: 'ai-tools', label: 'AI Tools', emoji: '🤖' },
  { id: 'claude-ai', label: 'Claude AI', emoji: '🧠' },
  { id: 'chatgpt', label: 'ChatGPT', emoji: '💬' },
  { id: 'gohighlevel', label: 'GoHighLevel', emoji: '📈' },
  { id: 'canva', label: 'Canva', emoji: '🎨' },
  { id: 'teaching', label: 'Teaching', emoji: '📚' },
  { id: 'virtual-assistant', label: 'Virtual Assistant', emoji: '🤝' },
  { id: 'productivity', label: 'Productivity', emoji: '⏱️' },
  { id: 'self-improvement', label: 'Self Improvement', emoji: '💪' },
  { id: 'youtube-growth', label: 'YouTube Growth', emoji: '📹' },
];

const CATEGORY_TO_COMPOSITION: Record<string, string> = {
  'ai-tools': 'AITools',
  'claude-ai': 'ClaudeAI',
  'chatgpt': 'ChatGPT',
  'gohighlevel': 'GoHighLevel',
  'canva': 'Canva',
  'teaching': 'Teaching',
  'virtual-assistant': 'VirtualAssistant',
  'productivity': 'Productivity',
  'self-improvement': 'SelfImprovement',
  'youtube-growth': 'YouTubeGrowth',
};

interface VideoGenerationJob {
  videoId: string;
  scriptId: string;
  status: 'generating' | 'audio' | 'rendering' | 'completed' | 'failed';
  progress: number;
  voiceoverUrls: Record<string, string>;
  totalSeconds: number;
  downloadUrl?: string;
  compositionId?: string;
  audioProgress?: number;
}

const VOICE_PRESETS = [
  { id: 'professional', label: 'Professional' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'calm', label: 'Calm' },
  { id: 'authoritative', label: 'Authoritative' },
];

const MIX_PRESETS = [
  { id: 'focus', label: 'Focus', description: 'Voiceover dominant, subtle music' },
  { id: 'energetic', label: 'Energetic', description: 'Balanced, upbeat' },
  { id: 'calm', label: 'Calm', description: 'Peaceful, gentle music' },
  { id: 'balanced', label: 'Balanced', description: 'Standard mix' },
];

interface MusicTrack {
  id: string;
  name: string;
  genre: string;
  duration: number;
  bpm?: number;
}

export default function VideoGeneratorPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ai-tools');
  const [selectedVoicePreset, setSelectedVoicePreset] = useState<string>('professional');
  const [selectedMixPreset, setSelectedMixPreset] = useState<string>('balanced');
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [selectedMusicTrackId, setSelectedMusicTrackId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isFetchingMusic, setIsFetchingMusic] = useState(false);
  const [generationJobs, setGenerationJobs] = useState<VideoGenerationJob[]>([]);
  const [selectedScriptData, setSelectedScriptData] = useState<Script | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCompositionId, setPreviewCompositionId] = useState<string>('');

  useEffect(() => {
    fetchScripts();
  }, []);

  useEffect(() => {
    fetchMusicTracks(selectedCategory);
  }, [selectedCategory]);

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

  async function fetchMusicTracks(categoryId: string) {
    setIsFetchingMusic(true);
    try {
      const response = await fetch(`/api/audio/music?category=${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setMusicTracks(data.tracks);
        if (data.tracks.length > 0) {
          setSelectedMusicTrackId(data.tracks[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch music tracks:', error);
    } finally {
      setIsFetchingMusic(false);
    }
  }

  function handlePreview() {
    if (!selectedScriptData) return;
    setPreviewCompositionId(CATEGORY_TO_COMPOSITION[selectedCategory]);
    setIsPreviewOpen(true);
  }

  async function generateVoiceover() {
    if (!selectedScript) return;

    setIsGeneratingAudio(true);
    try {
      const response = await fetch('/api/scripts/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scriptId: selectedScript,
          voicePreset: selectedVoicePreset,
          provider: 'mock', // Use mock by default, can switch to 'openai' with API key
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Voiceover generated:', data);
        return data.voiceoverUrls;
      }
    } catch (error) {
      console.error('Failed to generate voiceover:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
    return {};
  }

  async function handleGenerateVideo() {
    if (!selectedScript || !selectedScriptData) return;

    setIsLoading(true);
    try {
      // Step 1: Generate voiceover
      const voiceoverUrls = await generateVoiceover();

      const sections = [
        { id: 'hook', text: selectedScriptData.hook || '', duration: 300 },
        { id: 'intro', text: selectedScriptData.intro || '', duration: 300 },
        { id: 'body', text: selectedScriptData.body || '', duration: 600 },
        { id: 'examples', text: selectedScriptData.examples || '', duration: 400 },
        { id: 'cta', text: selectedScriptData.cta || '', duration: 200 },
        { id: 'outro', text: selectedScriptData.outro || '', duration: 200 },
      ].filter((s) => s.text.trim());

      // Step 2: Configure music
      let musicConfig = null;
      if (selectedMusicTrackId) {
        try {
          const musicResponse = await fetch('/api/audio/music', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              categoryId: selectedCategory,
              trackId: selectedMusicTrackId,
              totalDurationSeconds: selectedScriptData.speakingTime || 60,
              mixPreset: selectedMixPreset,
            }),
          });

          if (musicResponse.ok) {
            musicConfig = await musicResponse.json();
          }
        } catch (error) {
          console.error('Failed to configure music:', error);
        }
      }

      // Step 3: Render video
      const response = await fetch('/api/videos/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({
          scriptId: selectedScript,
          title: selectedScriptData.title,
          hook: selectedScriptData.hook,
          category: selectedCategory,
          compositionId: CATEGORY_TO_COMPOSITION[selectedCategory],
          sections,
          voiceoverUrls,
          musicConfig: musicConfig?.audioSync,
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
              <label className="text-sm font-medium">Content Category</label>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CONTENT_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.emoji} {category.label}
                  </option>
                ))}
              </Select>
            </div>

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

            <div>
              <label className="text-sm font-medium">Voice Preset</label>
              <Select
                value={selectedVoicePreset}
                onChange={(e) => setSelectedVoicePreset(e.target.value)}
              >
                {VOICE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="border-t pt-3">
              <label className="text-sm font-medium block mb-2">🎵 Background Music</label>
              <Select
                value={selectedMusicTrackId}
                onChange={(e) => setSelectedMusicTrackId(e.target.value)}
                disabled={isFetchingMusic || musicTracks.length === 0}
              >
                <option value="">Select music track...</option>
                {musicTracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name} ({track.genre})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Audio Mix</label>
              <Select
                value={selectedMixPreset}
                onChange={(e) => setSelectedMixPreset(e.target.value)}
              >
                {MIX_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label} - {preset.description}
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

            <div className="flex gap-2">
              <Button
                onClick={handlePreview}
                disabled={!selectedScriptData}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                onClick={handleGenerateVideo}
                disabled={!selectedScript || isLoading || isGeneratingAudio}
                className="flex-1 gap-2"
              >
                <Film className="w-4 h-4" />
                {isGeneratingAudio ? 'Creating Audio...' : isLoading ? 'Rendering...' : 'Render'}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Video generation pipeline:
              <br />
              1. 🎙️ Generate TTS voiceover
              <br />
              2. 🎵 Sync with background
              <br />
              3. 🎬 Render with Remotion
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
                          <div className="text-sm font-semibold text-right">
                            {job.status === 'completed' && <span className="text-green-500">✓ Ready</span>}
                            {job.status === 'audio' && <span className="text-blue-500">🎙️ Audio</span>}
                            {job.status === 'rendering' && <span className="text-blue-500">🎬 {job.progress}%</span>}
                            {job.status === 'generating' && <span className="text-blue-500">⏳ {job.progress}%</span>}
                            {job.status === 'failed' && <span className="text-red-500">✗ Error</span>}
                          </div>
                        </div>

                        {(job.status === 'audio' || job.status === 'rendering' || job.status === 'generating') && (
                          <div className="space-y-1">
                            {job.status === 'audio' && (
                              <>
                                <div className="text-xs text-muted-foreground">Generating voiceover...</div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-yellow-500 h-2 rounded-full transition-all"
                                    style={{ width: `${job.audioProgress || 30}%` }}
                                  />
                                </div>
                              </>
                            )}
                            {(job.status === 'rendering' || job.status === 'generating') && (
                              <>
                                <div className="text-xs text-muted-foreground">Rendering video...</div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${job.progress}%` }}
                                  />
                                </div>
                              </>
                            )}
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

      {/* Preview Modal */}
      <Modal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        title={`Preview: ${CONTENT_CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Video'}`}
      >
        <div className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-2xl">
                {CONTENT_CATEGORIES.find((c) => c.id === selectedCategory)?.emoji}
              </p>
              <p className="text-sm text-muted-foreground">
                Remotion Player Preview
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Select a script and click Preview to see your video composition in action.
              </p>
              {previewCompositionId && (
                <p className="text-xs font-mono text-muted-foreground mt-4">
                  Composition: {previewCompositionId}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            This preview shows how your script will be rendered using the {CONTENT_CATEGORIES.find((c) => c.id === selectedCategory)?.label} theme. The actual rendering happens server-side with audio synchronization.
          </p>
        </div>
      </Modal>
    </div>
  );
}
