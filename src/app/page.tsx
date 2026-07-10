import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">YouTube Content Studio</h1>
          <p className="text-muted-foreground">
            AI-powered platform for creating and managing YouTube content
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Powered by Claude AI to help you generate scripts, optimize SEO, and manage your content pipeline.
        </p>

        <Link href="/video-ideas">
          <Button className="w-full" size="lg">
            Get Started
          </Button>
        </Link>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">Features:</p>
          <ul className="text-sm space-y-2 text-muted-foreground text-left">
            <li>✨ Video Idea Management</li>
            <li>📝 AI-Powered Script Writing</li>
            <li>🔍 SEO Optimization</li>
            <li>📚 Prompt Library</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
