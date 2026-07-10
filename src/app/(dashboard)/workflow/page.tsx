'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkflowStatus } from '@/components/workflow-status';
import { ThumbnailPromptGenerator } from '@/components/thumbnail-prompt-generator';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight } from 'lucide-react';

const WORKFLOW_PIPELINE = [
  { id: 'idea', label: 'Idea', description: 'Create video concept', icon: '💡' },
  { id: 'research', label: 'Research', description: 'Research & notes', icon: '📚' },
  { id: 'script', label: 'Script', description: 'Write video script', icon: '✍️' },
  { id: 'seo', label: 'SEO', description: 'Generate SEO metadata', icon: '🔍' },
  { id: 'thumbnail', label: 'Thumbnail', description: 'Create design prompt', icon: '🖼️' },
  { id: 'video', label: 'Video', description: 'Generate video', icon: '🎬' },
  { id: 'review', label: 'Review', description: 'Review & approve', icon: '👁️' },
  { id: 'upload', label: 'Upload', description: 'Publish to YouTube', icon: '🚀' },
];

interface WorkflowVideo {
  id: string;
  title: string;
  category: string;
  workflowStep: string;
  researchNotesId?: string;
  scriptId?: string;
  seoDataId?: string;
  thumbnailPromptId?: string;
  videoId?: string;
  youtubeUploadId?: string;
}

export default function WorkflowPage() {
  const [videos, setVideos] = useState<WorkflowVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<WorkflowVideo | null>(null);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [researchNotes, setResearchNotes] = useState('');
  const [isThumbnailOpen, setIsThumbnailOpen] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      const response = await fetch('/api/videos', {
        headers: { 'x-user-id': 'default-user' },
      });
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function groupVideosByStep() {
    const grouped = new Map<string, WorkflowVideo[]>();
    WORKFLOW_PIPELINE.forEach(step => {
      grouped.set(step.id, []);
    });
    videos.forEach(video => {
      const step = video.workflowStep || 'idea';
      if (grouped.has(step)) {
        grouped.get(step)!.push(video);
      }
    });
    return grouped;
  }

  const videosByStep = groupVideosByStep();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading workflow...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Creation Workflow</h1>
        <p className="text-muted-foreground mt-1">Track your videos through the entire production pipeline</p>
      </div>

      {/* Workflow Pipeline View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {WORKFLOW_PIPELINE.map((step) => {
          const count = videosByStep.get(step.id)?.length || 0;
          return (
            <Card
              key={step.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                count > 0 ? 'border-primary/50 bg-primary/5' : 'opacity-60'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{step.icon}</span>
                    <div>
                      <CardTitle className="text-sm">{step.label}</CardTitle>
                      <CardDescription className="text-xs">{step.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">{count}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {videosByStep.get(step.id)?.slice(0, 2).map((video) => (
                    <button
                      key={video.id}
                      onClick={() => {
                        setSelectedVideo(video);
                        setIsStepModalOpen(true);
                      }}
                      className="w-full text-left p-2 bg-muted rounded hover:bg-muted/80 transition-colors text-sm line-clamp-1"
                    >
                      {video.title}
                    </button>
                  ))}
                  {count > 2 && (
                    <p className="text-xs text-muted-foreground p-2">+{count - 2} more videos</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{videos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {videos.filter(v => !['idea', 'upload'].includes(v.workflowStep || 'idea')).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready to Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {videos.filter(v => (v.workflowStep || 'idea') === 'review').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {videos.filter(v => (v.workflowStep || 'idea') === 'upload').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Details Modal */}
      <Modal open={isStepModalOpen} onOpenChange={setIsStepModalOpen} title={selectedVideo?.title}>
        {selectedVideo && (
          <div className="space-y-6">
            <WorkflowStatus currentStep={selectedVideo.workflowStep || 'idea'} />

            {/* Current Step Content */}
            {(selectedVideo.workflowStep || 'idea') === 'research' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Research Notes</h4>
                  <Textarea
                    placeholder="Add research notes, links, facts, insights..."
                    value={researchNotes}
                    onChange={(e) => setResearchNotes(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                <Button className="w-full">Save Research Notes</Button>
              </div>
            )}

            {(selectedVideo.workflowStep || 'idea') === 'thumbnail' && (
              <ThumbnailPromptGenerator
                videoTitle={selectedVideo.title}
                topic={selectedVideo.category}
              />
            )}

            {/* Navigation */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsStepModalOpen(false)}
              >
                Close
              </Button>
              <Button className="gap-2">
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
