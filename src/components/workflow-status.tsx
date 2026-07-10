'use client';

import { CheckCircle2, Circle, Lock } from 'lucide-react';

const WORKFLOW_STEPS = [
  { id: 'idea', label: 'Idea', icon: '💡' },
  { id: 'research', label: 'Research', icon: '📚' },
  { id: 'script', label: 'Script', icon: '✍️' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
  { id: 'thumbnail', label: 'Thumbnail', icon: '🖼️' },
  { id: 'video', label: 'Video', icon: '🎬' },
  { id: 'review', label: 'Review', icon: '👁️' },
  { id: 'upload', label: 'Upload', icon: '🚀' },
];

interface WorkflowStatusProps {
  currentStep: string;
  videoTitle?: string;
  compact?: boolean;
}

export function WorkflowStatus({ currentStep, videoTitle, compact = false }: WorkflowStatusProps) {
  const currentIndex = WORKFLOW_STEPS.findIndex(s => s.id === currentStep);

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {WORKFLOW_STEPS.map((step, idx) => (
          <div
            key={step.id}
            className={`h-2 flex-1 rounded-full transition-colors ${
              idx <= currentIndex ? 'bg-primary' : 'bg-muted'
            }`}
            title={step.label}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videoTitle && <h3 className="font-semibold text-sm">{videoTitle}</h3>}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isLocked = idx > currentIndex;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 min-w-fit"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-600'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary/50 scale-110'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-xs font-medium text-center w-12">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-green-500/10 rounded-md">
          <p className="text-green-700 font-medium">✓ Completed: {currentIndex + 1}/{WORKFLOW_STEPS.length}</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-md">
          <p className="text-primary font-medium">Current: {WORKFLOW_STEPS[currentIndex]?.label}</p>
        </div>
      </div>
    </div>
  );
}
