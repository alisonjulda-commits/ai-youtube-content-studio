'use client';

import { useState, useEffect } from 'react';
import { Save, Download, Trash2, Plus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SubtitleLine {
  id: string;
  index: number;
  startTime: number;
  endTime: number;
  text: string;
}

interface SubtitleEditorProps {
  videoIdeaId?: string;
  scriptId?: string;
  onSave?: (subtitleId: string) => void;
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const ms = milliseconds % 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

function parseTimeInput(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10);
  const rest = parts[1].split('.');
  const seconds = parseInt(rest[0], 10);
  const ms = parseInt((rest[1] || '0').padEnd(3, '0'), 10);
  return (minutes * 60 + seconds) * 1000 + ms;
}

export function SubtitleEditor({ videoIdeaId, scriptId, onSave }: SubtitleEditorProps) {
  const [title, setTitle] = useState('New Subtitles');
  const [language, setLanguage] = useState('en');
  const [lines, setLines] = useState<SubtitleLine[]>([]);
  const [format, setFormat] = useState<'srt' | 'vtt'>('srt');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingStart, setEditingStart] = useState('');
  const [editingEnd, setEditingEnd] = useState('');

  const [autoGenerating, setAutoGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const totalDuration = lines.length > 0 ? lines[lines.length - 1].endTime : 0;

  async function generateFromScript() {
    if (!scriptId) {
      setError('Script ID is required for auto-generation');
      return;
    }

    try {
      setAutoGenerating(true);
      setError('');

      const response = await fetch('/api/subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({
          title,
          language,
          videoIdeaId,
          scriptId,
          autoGenerate: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate subtitles');
      }

      const data = await response.json();
      // Fetch the generated subtitles
      const getResponse = await fetch(
        `/api/subtitles/${data.id}`,
        { headers: { 'x-user-id': 'default-user' } }
      );

      if (getResponse.ok) {
        const subtitle = await getResponse.json();
        setLines(subtitle.lines);
        setSuccess('Subtitles generated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate subtitles');
    } finally {
      setAutoGenerating(false);
    }
  }

  function handleEditLine(line: SubtitleLine) {
    setEditingId(line.id);
    setEditingText(line.text);
    setEditingStart(formatTime(line.startTime));
    setEditingEnd(formatTime(line.endTime));
  }

  function saveEdit() {
    if (!editingId) return;

    const startMs = parseTimeInput(editingStart);
    const endMs = parseTimeInput(editingEnd);

    if (startMs >= endMs) {
      setError('Start time must be before end time');
      return;
    }

    setLines(
      lines.map((line) =>
        line.id === editingId
          ? { ...line, text: editingText, startTime: startMs, endTime: endMs }
          : line
      )
    );

    setEditingId(null);
    setError('');
  }

  function deleteLine(id: string) {
    setLines(lines.filter((line) => line.id !== id));
  }

  function addNewLine() {
    const newStart = totalDuration + 1000;
    const newEnd = newStart + 3000;

    const newLine: SubtitleLine = {
      id: `line-${Date.now()}`,
      index: lines.length + 1,
      startTime: newStart,
      endTime: newEnd,
      text: 'New subtitle',
    };

    setLines([...lines, newLine]);
    handleEditLine(newLine);
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      setError('');

      const response = await fetch('/api/subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user',
        },
        body: JSON.stringify({
          title,
          language,
          videoIdeaId,
          scriptId,
          autoGenerate: false,
          lines,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save subtitles');
      }

      const result = await response.json();
      setSuccess('Subtitles saved successfully');
      setTimeout(() => setSuccess(''), 3000);
      onSave?.(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleExport(exportFormat: 'srt' | 'vtt') {
    if (lines.length === 0) {
      setError('No subtitles to export');
      return;
    }

    try {
      setIsExporting(true);
      setError('');

      // First save if not saved yet
      let subtitleId = '';
      const listResponse = await fetch('/api/subtitles?limit=1', {
        headers: { 'x-user-id': 'default-user' },
      });

      if (listResponse.ok) {
        const listData = await listResponse.json();
        if (listData.subtitles.length > 0) {
          const recent = listData.subtitles[0];
          if (recent.title === title) {
            subtitleId = recent.id;
          }
        }
      }

      if (!subtitleId) {
        const saveResponse = await fetch('/api/subtitles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'default-user',
          },
          body: JSON.stringify({
            title,
            language,
            videoIdeaId,
            scriptId,
            autoGenerate: false,
            lines,
          }),
        });

        if (!saveResponse.ok) {
          throw new Error('Failed to save before export');
        }

        const saveData = await saveResponse.json();
        subtitleId = saveData.id;
      }

      const exportUrl = `/api/subtitles/${subtitleId}/export?format=${exportFormat}`;
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = `${title.replace(/\s+/g, '_')}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(`Subtitles exported as ${exportFormat.toUpperCase()}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subtitle Editor</h1>
        <p className="text-muted-foreground mt-1">Create and edit subtitles for your video</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 rounded-md text-sm">
          {success}
        </div>
      )}

      {/* Config Section */}
      <Card>
        <CardHeader>
          <CardTitle>Subtitle Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Subtitle project name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
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
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'srt' | 'vtt')}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="srt">SRT</option>
                <option value="vtt">VTT</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Total Duration</label>
              <Input
                value={formatTime(totalDuration)}
                disabled
                className="bg-secondary"
              />
            </div>
          </div>

          {scriptId && (
            <Button
              onClick={generateFromScript}
              disabled={autoGenerating}
              variant="outline"
              className="w-full"
            >
              {autoGenerating ? 'Generating...' : 'Auto-Generate from Script'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Subtitle Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Subtitle Lines ({lines.length})</CardTitle>
          <CardDescription>Edit timing and text for each subtitle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {lines.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No subtitles yet. Add one or generate from script.
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {lines.map((line) => (
                <div
                  key={line.id}
                  className="border rounded-lg p-4 space-y-3 bg-secondary/50"
                >
                  {editingId === line.id ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium">Start (MM:SS.mmm)</label>
                          <Input
                            value={editingStart}
                            onChange={(e) => setEditingStart(e.target.value)}
                            placeholder="00:05.000"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">End (MM:SS.mmm)</label>
                          <Input
                            value={editingEnd}
                            onChange={(e) => setEditingEnd(e.target.value)}
                            placeholder="00:08.000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium">Text</label>
                        <Textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          placeholder="Subtitle text"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit} className="flex-1">
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">Line {line.index}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(line.startTime)} → {formatTime(line.endTime)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditLine(line)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteLine(line.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{line.text}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={addNewLine}
            variant="outline"
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Subtitle
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || lines.length === 0}
          className="gap-2 flex-1"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Subtitles'}
        </Button>
        <Button
          onClick={() => handleExport('srt')}
          disabled={isExporting || lines.length === 0}
          variant="outline"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export SRT
        </Button>
        <Button
          onClick={() => handleExport('vtt')}
          disabled={isExporting || lines.length === 0}
          variant="outline"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export VTT
        </Button>
      </div>
    </div>
  );
}
