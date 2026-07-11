'use client';

import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface YoutubeUploadFormProps {
  videoPath: string;
  videoIdeaId?: string;
  onUploadStart?: (jobId: string) => void;
  onUploadComplete?: (result: any) => void;
}

const YOUTUBE_CATEGORIES = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '17': 'Sports',
  '18': 'Short Movies',
  '19': 'Travel & Events',
  '20': 'Gaming',
  '21': 'Videoblogging',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'Howto & Style',
  '27': 'Education',
  '28': 'Science & Technology',
  '29': 'Nonprofits & Activism',
};

export function YoutubeUploadForm({
  videoPath,
  videoIdeaId,
  onUploadStart,
  onUploadComplete,
}: YoutubeUploadFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    tags: string;
    category: string;
    language: string;
    visibility: 'private' | 'unlisted' | 'public';
    license: 'standard' | 'creativeCommon';
    madeForKids: boolean;
    scheduledPublishAt: string;
  }>({
    title: '',
    description: '',
    tags: '',
    category: '22',
    language: 'en',
    visibility: 'private',
    license: 'standard',
    madeForKids: false,
    scheduledPublishAt: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadJobId, setUploadJobId] = useState('');

  async function handleCreateUpload() {
    try {
      setError('');
      setIsLoading(true);

      const response = await fetch('/api/youtube/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({
          videoPath,
          videoIdeaId,
          title: formData.title,
          description: formData.description,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          category: formData.category,
          language: formData.language,
          visibility: formData.visibility,
          license: formData.license,
          madeForKids: formData.madeForKids,
          publishAt: formData.scheduledPublishAt
            ? new Date(formData.scheduledPublishAt).toISOString()
            : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create upload');
      }

      const result = await response.json();
      setUploadJobId(result.jobId);

      // Start upload
      await startUpload(result.jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsLoading(false);
    }
  }

  async function startUpload(jobId: string) {
    try {
      const response = await fetch(`/api/youtube/upload/${jobId}/start`, {
        method: 'POST',
        headers: { 'x-user-id': 'default-user' },
      });

      if (!response.ok) {
        throw new Error('Failed to start upload');
      }

      onUploadStart?.(jobId);

      // Poll for progress
      pollUploadProgress(jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start upload');
      setIsLoading(false);
    }
  }

  async function pollUploadProgress(jobId: string) {
    const maxAttempts = 120; // 10 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/youtube/upload/${jobId}`, {
          headers: { 'x-user-id': 'default-user' },
        });

        if (!response.ok) {
          throw new Error('Failed to get upload status');
        }

        const data = await response.json();
        setUploadProgress(data.progress);

        if (
          data.status === 'published' ||
          data.status === 'processing'
        ) {
          setIsLoading(false);
          onUploadComplete?.(data);
          return;
        }

        if (data.status === 'failed') {
          setError(data.errorMessage || 'Upload failed');
          setIsLoading(false);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Check every 5 seconds
        } else {
          setError('Upload timeout');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Poll error:', err);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setError('Upload monitoring failed');
          setIsLoading(false);
        }
      }
    };

    poll();
  }

  async function handleCancel() {
    if (!uploadJobId) return;

    try {
      const response = await fetch(`/api/youtube/upload/${uploadJobId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'default-user' },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel upload');
      }

      setUploadJobId('');
      setUploadProgress(0);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel');
    }
  }

  if (uploadJobId && isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploading to YouTube</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Upload Progress</span>
              <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {uploadProgress < 100
              ? 'Uploading your video to YouTube...'
              : 'Processing your video...'}
          </p>
          {uploadProgress < 100 && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={!uploadJobId}
              className="w-full"
            >
              Cancel Upload
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload to YouTube
        </CardTitle>
        <CardDescription>
          Configure your video metadata and upload directly to YouTube
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Video Title *</label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter video title (max 100 characters)"
            maxLength={100}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.title.length}/100
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter video description (max 5000 characters)"
            maxLength={5000}
            disabled={isLoading}
            className="min-h-24"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.description.length}/5000
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Tags</label>
          <Input
            value={formData.tags}
            onChange={(e) =>
              setFormData({ ...formData, tags: e.target.value })
            }
            placeholder="Enter tags separated by commas (max 500 tags)"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.tags.split(',').filter(Boolean).length} tags
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              disabled={isLoading}
            >
              {Object.entries(YOUTUBE_CATEGORIES).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Language</label>
            <Select
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              disabled={isLoading}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
              <option value="ko">Korean</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Visibility</label>
            <Select
              value={formData.visibility}
              onChange={(e) => {
                const value = e.target.value as 'private' | 'unlisted' | 'public';
                setFormData({ ...formData, visibility: value });
              }}
              disabled={isLoading}
            >
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="public">Public</option>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">License</label>
            <Select
              value={formData.license}
              onChange={(e) => {
                const value = e.target.value as 'standard' | 'creativeCommon';
                setFormData({ ...formData, license: value });
              }}
              disabled={isLoading}
            >
              <option value="standard">Standard YouTube License</option>
              <option value="creativeCommon">Creative Commons</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Publish Schedule (Optional)</label>
          <Input
            type="datetime-local"
            value={formData.scheduledPublishAt}
            onChange={(e) =>
              setFormData({ ...formData, scheduledPublishAt: e.target.value })
            }
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Leave empty to publish immediately
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.madeForKids}
            onChange={(e) =>
              setFormData({ ...formData, madeForKids: e.target.checked })
            }
            disabled={isLoading}
            className="rounded"
          />
          <label className="text-sm font-medium cursor-pointer">
            This video is made for kids
          </label>
        </div>

        {!uploadJobId && (
          <Button
            onClick={handleCreateUpload}
            disabled={isLoading || !formData.title}
            className="w-full gap-2"
          >
            <Upload className="w-4 h-4" />
            {isLoading ? 'Preparing upload...' : 'Upload to YouTube'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
