'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ExternalLink, CheckCircle2, Circle, AlertCircle, Zap } from 'lucide-react';

const WORKFLOW_PIPELINE = [
  {
    id: 'idea',
    label: 'Idea',
    description: 'Create video concept',
    icon: '💡',
    action: '/video-ideas',
    actionLabel: 'Go to Video Ideas',
  },
  {
    id: 'research',
    label: 'Research',
    description: 'Gather & document research',
    icon: '📚',
    action: '/workflow',
    actionLabel: 'Add Research Notes',
  },
  {
    id: 'script',
    label: 'Script',
    description: 'Write video script',
    icon: '✍️',
    action: '/script-writer',
    actionLabel: 'Go to Script Writer',
  },
  {
    id: 'seo',
    label: 'SEO',
    description: 'Generate SEO metadata',
    icon: '🔍',
    action: '/seo-engine',
    actionLabel: 'Go to SEO Engine',
  },
  {
    id: 'thumbnail',
    label: 'Thumbnail',
    description: 'Create design prompt',
    icon: '🖼️',
    action: '/seo-engine',
    actionLabel: 'Generate Thumbnail Prompt',
  },
  {
    id: 'video',
    label: 'Video',
    description: 'Generate video with AI',
    icon: '🎬',
    action: '/video-generator',
    actionLabel: 'Go to Video Generator',
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Review & approve',
    icon: '👁️',
    action: '/workflow',
    actionLabel: 'Preview & Review',
  },
  {
    id: 'upload',
    label: 'Upload',
    description: 'Publish to YouTube',
    icon: '🚀',
    action: '/workflow',
    actionLabel: 'Publish Video',
  },
];

interface WorkflowVideo {
  id: string;
  title: string;
  category: string;
  workflowStep: string;
  description?: string;
}

export default function WorkflowPage() {
  const [videos, setVideos] = useState<WorkflowVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<WorkflowVideo | null>(null);
  const [selectedStep, setSelectedStep] = useState<typeof WORKFLOW_PIPELINE[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [researchNotes, setResearchNotes] = useState('');

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
    WORKFLOW_PIPELINE.forEach((step) => {
      grouped.set(step.id, []);
    });
    videos.forEach((video) => {
      const step = video.workflowStep || 'idea';
      if (grouped.has(step)) {
        grouped.get(step)!.push(video);
      }
    });
    return grouped;
  }

  async function progressWorkflow(videoId: string, fromStep: string) {
    const currentIndex = WORKFLOW_PIPELINE.findIndex((s) => s.id === fromStep);
    if (currentIndex < WORKFLOW_PIPELINE.length - 1) {
      const nextStep = WORKFLOW_PIPELINE[currentIndex + 1].id;
      try {
        await fetch(`/api/videos/${videoId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'default-user',
          },
          body: JSON.stringify({ workflowStep: nextStep }),
        });
        fetchVideos();
        setIsDetailModalOpen(false);
      } catch (error) {
        console.error('Failed to progress workflow:', error);
      }
    }
  }

  const videosByStep = groupVideosByStep();
  const totalVideos = videos.length;
  const inProgress = videos.filter((v) => !['idea', 'upload'].includes(v.workflowStep || 'idea')).length;
  const readyToUpload = videos.filter((v) => (v.workflowStep || 'idea') === 'review').length;
  const uploaded = videos.filter((v) => (v.workflowStep || 'idea') === 'upload').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading workflow...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Production Workflow</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage your videos through the entire production pipeline
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVideos}</p>
            <p className="text-xs text-muted-foreground mt-1">in production</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
            <p className="text-xs text-muted-foreground mt-1">being created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready to Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{readyToUpload}</p>
            <p className="text-xs text-muted-foreground mt-1">need publishing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{uploaded}</p>
            <p className="text-xs text-muted-foreground mt-1">on YouTube</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Production Pipeline</CardTitle>
          <CardDescription>
            Videos progress through 8 steps from idea to YouTube publication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW_PIPELINE.map((step, index) => {
              const count = videosByStep.get(step.id)?.length || 0;
              const isActive = count > 0;

              return (
                <div key={step.id} className="relative">
                  {/* Connector line */}
                  {index < WORKFLOW_PIPELINE.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-2 w-4 h-0.5 bg-border" />
                  )}

                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isActive ? 'border-primary/50 bg-primary/5' : 'opacity-60'
                    }`}
                    onClick={() => {
                      if (isActive) {
                        setSelectedStep(step);
                        setIsDetailModalOpen(true);
                      }
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{step.icon}</span>
                          {count > 0 && (
                            <Badge className="bg-primary text-primary-foreground">{count}</Badge>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base">{step.label}</CardTitle>
                          <CardDescription className="text-xs">{step.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    {isActive && (
                      <CardContent>
                        <div className="space-y-2">
                          {videosByStep.get(step.id)?.slice(0, 3).map((video) => (
                            <div
                              key={video.id}
                              className="p-2 bg-muted rounded hover:bg-muted/80 transition-colors text-sm line-clamp-1"
                            >
                              {video.title}
                            </div>
                          ))}
                          {count > 3 && (
                            <p className="text-xs text-muted-foreground p-2">+{count - 3} more</p>
                          )}
                        </div>
                      </CardContent>
                    )}

                    {!isActive && (
                      <CardContent>
                        <p className="text-xs text-muted-foreground">No videos yet</p>
                      </CardContent>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Video Progress View */}
      <Card>
        <CardHeader>
          <CardTitle>Video Progress</CardTitle>
          <CardDescription>See where each video is in the production pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {videos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No videos yet. Start by creating a video idea.
              </p>
            ) : (
              videos.map((video) => {
                const stepIndex = WORKFLOW_PIPELINE.findIndex((s) => s.id === (video.workflowStep || 'idea'));
                const progress = ((stepIndex + 1) / WORKFLOW_PIPELINE.length) * 100;

                return (
                  <div key={video.id} className="space-y-2 pb-3 border-b last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.category}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedVideo(video);
                          const step = WORKFLOW_PIPELINE.find((s) => s.id === (video.workflowStep || 'idea'));
                          setSelectedStep(step || WORKFLOW_PIPELINE[0]);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Step {stepIndex + 1} of {WORKFLOW_PIPELINE.length}
                        </span>
                        <span className="font-medium">
                          {WORKFLOW_PIPELINE[stepIndex]?.label}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status indicators */}
                    <div className="flex gap-1 flex-wrap">
                      {WORKFLOW_PIPELINE.map((step) => {
                        const isCompleted = WORKFLOW_PIPELINE.indexOf(step) < stepIndex;
                        const isCurrent = step.id === (video.workflowStep || 'idea');

                        return (
                          <div
                            key={step.id}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-green-100 text-green-700'
                                : isCurrent
                                ? 'bg-primary text-primary-foreground ring-2 ring-primary/50'
                                : 'bg-muted text-muted-foreground'
                            }`}
                            title={step.label}
                          >
                            {isCompleted ? '✓' : step.icon.charAt(0)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Modal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        title={`${selectedStep?.label} ${selectedVideo ? `- ${selectedVideo.title}` : ''}`}
      >
        {selectedStep && selectedVideo && (
          <div className="space-y-6">
            {/* Step Information */}
            <div>
              <h4 className="font-semibold mb-2">Step Details</h4>
              <p className="text-sm text-muted-foreground">{selectedStep.description}</p>
            </div>

            {/* Step-Specific Content */}
            {selectedStep.id === 'research' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Research Notes</label>
                  <Textarea
                    placeholder="Add research notes, links, facts, insights..."
                    value={researchNotes}
                    onChange={(e) => setResearchNotes(e.target.value)}
                    className="min-h-32 mt-2"
                  />
                </div>
              </div>
            )}

            {selectedStep.id === 'review' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Ready to Upload?</p>
                      <p>
                        Please review the video to ensure audio quality, SEO metadata, and all
                        content matches your standards before publishing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>

              {selectedStep.action && selectedStep.action !== '/workflow' ? (
                <Link href={selectedStep.action} className="flex-1">
                  <Button className="w-full gap-2">
                    <span>{selectedStep.actionLabel}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              ) : null}

              {/* Progress Button */}
              {selectedStep.id !== 'upload' && (
                <Button
                  className="gap-2"
                  onClick={() => progressWorkflow(selectedVideo.id, selectedStep.id)}
                >
                  <span>Mark as Complete</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}

              {selectedStep.id === 'upload' && (
                <Button disabled className="gap-2">
                  <span>Already Published</span>
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
