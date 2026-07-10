'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    channelName: 'My Channel',
    channelDescription: '',
    anthropicApiKey: '',
    openaiApiKey: '',
    brandPrimaryColor: '#6366f1',
    brandSecondaryColor: '#ec4899',
    theme: 'system',
  });

  const [isSaved, setIsSaved] = useState(false);

  async function handleSave() {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
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
            <CardTitle>Channel Information</CardTitle>
            <CardDescription>Your YouTube channel details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
