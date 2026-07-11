'use client';

import { useState, useEffect } from 'react';
import { Save, Youtube, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    ownerName: 'Julda Marie Alison',
    channelName: 'Julda Marie Alison',
    channelDescription: '',
    anthropicApiKey: '',
    openaiApiKey: '',
    brandPrimaryColor: '#6366f1',
    brandSecondaryColor: '#ec4899',
    theme: 'system',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [youtubeStatus, setYoutubeStatus] = useState<any>(null);
  const [youtubeLoading, setYoutubeLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchYoutubeStatus();
  }, []);

  useEffect(() => {
    checkYoutubeCallback();
  }, []);

  async function fetchYoutubeStatus() {
    try {
      const response = await fetch('/api/youtube/auth/status', {
        headers: { 'x-user-id': 'default-user' },
      });
      if (response.ok) {
        const data = await response.json();
        setYoutubeStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch YouTube status:', err);
    }
  }

  function checkYoutubeCallback() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('youtube_success')) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      fetchYoutubeStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (params.get('youtube_error')) {
      setError(`YouTube connection failed: ${params.get('youtube_error')}`);
      setTimeout(() => setError(''), 5000);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  async function handleYoutubeConnect() {
    try {
      setYoutubeLoading(true);
      const response = await fetch('/api/youtube/auth/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'default-user' }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authUrl;
      } else {
        setError('Failed to start YouTube connection');
      }
    } catch (err) {
      setError('Error connecting to YouTube');
      console.error('YouTube connect error:', err);
    } finally {
      setYoutubeLoading(false);
    }
  }

  async function handleYoutubeDisconnect() {
    if (!confirm('Are you sure you want to disconnect your YouTube account?')) {
      return;
    }

    try {
      setYoutubeLoading(true);
      const response = await fetch('/api/youtube/auth/disconnect', {
        method: 'POST',
        headers: { 'x-user-id': 'default-user' },
      });

      if (response.ok) {
        setYoutubeStatus({ connected: false });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        setError('Failed to disconnect YouTube account');
      }
    } catch (err) {
      setError('Error disconnecting YouTube');
      console.error('YouTube disconnect error:', err);
    } finally {
      setYoutubeLoading(false);
    }
  }

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings', {
        headers: { 'x-user-id': 'default-user' },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setIsSaved(true);
        setError('');
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        setError('Failed to save settings');
      }
    } catch (err) {
      setError('Error saving settings');
      console.error('Failed to save settings:', err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your content studio configuration</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Creator Information</CardTitle>
            <CardDescription>Your personal branding and channel details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Owner Name</label>
              <Input
                value={settings.ownerName}
                onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Channel Name</label>
              <Input
                value={settings.channelName}
                onChange={(e) => setSettings({ ...settings, channelName: e.target.value })}
                placeholder="Your channel name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Channel Description</label>
              <Textarea
                value={settings.channelDescription}
                onChange={(e) => setSettings({ ...settings, channelDescription: e.target.value })}
                placeholder="Describe your channel..."
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Keep your API keys secure and never share them</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Anthropic API Key</label>
              <Input
                type="password"
                value={settings.anthropicApiKey}
                onChange={(e) => setSettings({ ...settings, anthropicApiKey: e.target.value })}
                placeholder="sk-ant-..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your API key from{' '}
                <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="underline">
                  console.anthropic.com
                </a>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">OpenAI API Key (Optional)</label>
              <Input
                type="password"
                value={settings.openaiApiKey}
                onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                placeholder="sk-..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-600" />
              YouTube Connection
            </CardTitle>
            <CardDescription>Connect your YouTube account for direct uploads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {youtubeStatus?.connected ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 space-y-3">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Connected</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Channel:</span>{' '}
                      <span className="font-medium">{youtubeStatus.channelName}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Connected since:</span>{' '}
                      <span className="font-medium">
                        {new Date(youtubeStatus.connectedAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleYoutubeDisconnect}
                  disabled={youtubeLoading}
                  className="w-full gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {youtubeLoading ? 'Disconnecting...' : 'Disconnect YouTube'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800 flex items-gap gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    <p className="font-medium">Not connected</p>
                    <p className="text-xs mt-1">Connect your YouTube account to upload videos directly from the studio</p>
                  </div>
                </div>
                <Button
                  onClick={handleYoutubeConnect}
                  disabled={youtubeLoading}
                  className="w-full bg-red-600 hover:bg-red-700 gap-2"
                >
                  <Youtube className="w-4 h-4" />
                  {youtubeLoading ? 'Connecting...' : 'Connect YouTube Account'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Customize the appearance of your studio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  value={settings.brandPrimaryColor}
                  onChange={(e) => setSettings({ ...settings, brandPrimaryColor: e.target.value })}
                  className="w-12 h-10"
                />
                <Input
                  type="text"
                  value={settings.brandPrimaryColor}
                  onChange={(e) => setSettings({ ...settings, brandPrimaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Secondary Color</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  value={settings.brandSecondaryColor}
                  onChange={(e) => setSettings({ ...settings, brandSecondaryColor: e.target.value })}
                  className="w-12 h-10"
                />
                <Input
                  type="text"
                  value={settings.brandSecondaryColor}
                  onChange={(e) => setSettings({ ...settings, brandSecondaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Theme</label>
              <Select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaved ? 'Saved!' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
