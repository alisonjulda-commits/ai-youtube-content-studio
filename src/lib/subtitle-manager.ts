import { db } from './db';

export interface SubtitleLine {
  id: string;
  index: number;
  startTime: number; // milliseconds
  endTime: number; // milliseconds
  text: string;
}

export interface SubtitleConfig {
  title: string;
  language: string;
  videoIdeaId?: string;
  scriptId?: string;
}

// Generate subtitles from script sections
export async function generateSubtitlesFromScript(
  userId: string,
  scriptId: string,
  config: SubtitleConfig
): Promise<SubtitleLine[]> {
  // Fetch script from database
  const script = await db.script.findUnique({
    where: { id: scriptId },
  });

  if (!script) {
    throw new Error('Script not found');
  }

  if (script.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Parse script sections
  const sections = [
    { name: 'hook', text: script.hook },
    { name: 'intro', text: script.intro },
    { name: 'body', text: script.body },
    { name: 'examples', text: script.examples },
    { name: 'cta', text: script.cta },
    { name: 'outro', text: script.outro },
  ].filter((s): s is { name: string; text: string } => typeof s.text === 'string' && s.text.trim().length > 0);

  // Calculate timing (60 seconds total video)
  const totalDurationMs = 60 * 1000;
  const lines: SubtitleLine[] = [];
  let currentTime = 0;

  for (const section of sections) {
    // Estimate reading time: ~150 words per minute
    const wordCount = section.text.split(/\s+/).length;
    const readingTimeMs = (wordCount / 150) * 60 * 1000;

    // Split text into subtitle chunks (max ~42 chars per line for readability)
    const chunks = splitTextIntoSubtitles(section.text, 42);

    // Distribute chunks evenly across the section duration
    const chunkDuration = readingTimeMs / Math.max(chunks.length, 1);

    for (let i = 0; i < chunks.length; i++) {
      const startTime = Math.round(currentTime);
      const endTime = Math.round(currentTime + chunkDuration);

      lines.push({
        id: `${section.name}-${i}`,
        index: lines.length + 1,
        startTime,
        endTime,
        text: chunks[i],
      });

      currentTime = endTime;
    }
  }

  return lines;
}

// Split text into subtitle chunks
function splitTextIntoSubtitles(text: string, maxCharsPerLine: number): string[] {
  const chunks: string[] = [];
  const words = text.split(/\s+/);

  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        chunks.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    chunks.push(currentLine);
  }

  return chunks;
}

// Format time to SRT format (HH:MM:SS,mmm)
export function formatTimeSRT(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const ms = milliseconds % 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

// Format time to VTT format (HH:MM:SS.mmm)
export function formatTimeVTT(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const ms = milliseconds % 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

// Generate SRT content from subtitle lines
export function generateSRT(lines: SubtitleLine[]): string {
  return lines
    .map(
      (line) =>
        `${line.index}\n${formatTimeSRT(line.startTime)} --> ${formatTimeSRT(line.endTime)}\n${line.text}`
    )
    .join('\n\n');
}

// Generate VTT content from subtitle lines
export function generateVTT(lines: SubtitleLine[]): string {
  const header = 'WEBVTT\n\n';
  const content = lines
    .map(
      (line) =>
        `${formatTimeVTT(line.startTime)} --> ${formatTimeVTT(line.endTime)}\n${line.text}`
    )
    .join('\n\n');

  return header + content;
}

// Parse SRT content to subtitle lines
export function parseSRT(content: string): SubtitleLine[] {
  const lines: SubtitleLine[] = [];
  const blocks = content.trim().split('\n\n');

  for (const block of blocks) {
    const lines_in_block = block.trim().split('\n');
    if (lines_in_block.length < 3) continue;

    const index = parseInt(lines_in_block[0], 10);
    const timings = lines_in_block[1].split(' --> ');

    if (timings.length !== 2) continue;

    const startTime = parseSRTTime(timings[0].trim());
    const endTime = parseSRTTime(timings[1].trim());
    const text = lines_in_block.slice(2).join('\n');

    lines.push({
      id: `line-${index}`,
      index,
      startTime,
      endTime,
      text,
    });
  }

  return lines;
}

// Parse VTT content to subtitle lines
export function parseVTT(content: string): SubtitleLine[] {
  const lines: SubtitleLine[] = [];
  const blocks = content.split('\n\n');

  let lineIndex = 1;
  for (const block of blocks) {
    const lines_in_block = block.trim().split('\n');
    if (lines_in_block.length < 2) continue;

    const timingLine = lines_in_block.find((l) => l.includes('-->'));
    if (!timingLine) continue;

    const timings = timingLine.split('-->');
    if (timings.length !== 2) continue;

    const startTime = parseVTTTime(timings[0].trim());
    const endTime = parseVTTTime(timings[1].trim());
    const text = lines_in_block
      .filter((l) => !l.includes('-->'))
      .join('\n')
      .trim();

    if (text) {
      lines.push({
        id: `line-${lineIndex}`,
        index: lineIndex,
        startTime,
        endTime,
        text,
      });
      lineIndex++;
    }
  }

  return lines;
}

// Parse SRT time format (HH:MM:SS,mmm)
function parseSRTTime(timeStr: string): number {
  const [time, ms] = timeStr.split(',');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return (hours * 3600 + minutes * 60 + seconds) * 1000 + parseInt(ms, 10);
}

// Parse VTT time format (HH:MM:SS.mmm)
function parseVTTTime(timeStr: string): number {
  const [time, ms] = timeStr.split('.');
  const parts = time.split(':');
  let hours = 0,
    minutes = 0,
    seconds = 0;

  if (parts.length === 3) {
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
    seconds = parseInt(parts[2], 10);
  } else if (parts.length === 2) {
    minutes = parseInt(parts[0], 10);
    seconds = parseInt(parts[1], 10);
  } else {
    seconds = parseInt(parts[0], 10);
  }

  return (hours * 3600 + minutes * 60 + seconds) * 1000 + parseInt(ms, 10);
}

// Validate subtitle timing (no overlaps, proper order)
export function validateSubtitleTiming(lines: SubtitleLine[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (lines.length === 0) {
    return { valid: true, errors: [] };
  }

  // Check order
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].endTime > lines[i + 1].startTime) {
      errors.push(
        `Line ${lines[i].index} overlaps with line ${lines[i + 1].index}`
      );
    }

    if (lines[i].startTime >= lines[i].endTime) {
      errors.push(`Line ${lines[i].index} has invalid timing (start >= end)`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Save subtitles to database
export async function saveSubtitles(
  userId: string,
  lines: SubtitleLine[],
  config: SubtitleConfig
): Promise<string> {
  // Validate timing
  const validation = validateSubtitleTiming(lines);
  if (!validation.valid) {
    throw new Error(`Subtitle validation failed: ${validation.errors.join(', ')}`);
  }

  // Generate content based on format
  const content =
    config.language === 'en' ? generateSRT(lines) : generateVTT(lines);

  const subtitle = await db.subtitle.create({
    data: {
      userId,
      title: config.title,
      language: config.language,
      format: 'srt',
      content,
      lines: JSON.stringify(lines),
      videoIdeaId: config.videoIdeaId,
      scriptId: config.scriptId,
      status: 'draft',
    },
  });

  return subtitle.id;
}

// Get subtitles
export async function getSubtitles(subtitleId: string, userId: string) {
  const subtitle = await db.subtitle.findUnique({
    where: { id: subtitleId },
  });

  if (!subtitle) {
    throw new Error('Subtitles not found');
  }

  if (subtitle.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return {
    id: subtitle.id,
    title: subtitle.title,
    language: subtitle.language,
    format: subtitle.format,
    status: subtitle.status,
    content: subtitle.content,
    lines: JSON.parse(subtitle.lines),
    createdAt: subtitle.createdAt,
    updatedAt: subtitle.updatedAt,
  };
}

// Update subtitles
export async function updateSubtitles(
  subtitleId: string,
  userId: string,
  updates: {
    lines?: SubtitleLine[];
    status?: string;
    title?: string;
  }
) {
  const subtitle = await db.subtitle.findUnique({
    where: { id: subtitleId },
  });

  if (!subtitle) {
    throw new Error('Subtitles not found');
  }

  if (subtitle.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const lines = updates.lines || JSON.parse(subtitle.lines);

  // Validate timing if lines changed
  if (updates.lines) {
    const validation = validateSubtitleTiming(lines);
    if (!validation.valid) {
      throw new Error(
        `Subtitle validation failed: ${validation.errors.join(', ')}`
      );
    }
  }

  const content = subtitle.format === 'srt' ? generateSRT(lines) : generateVTT(lines);

  const updated = await db.subtitle.update({
    where: { id: subtitleId },
    data: {
      title: updates.title || subtitle.title,
      content,
      lines: JSON.stringify(lines),
      status: updates.status || subtitle.status,
    },
  });

  return {
    id: updated.id,
    title: updated.title,
    language: updated.language,
    format: updated.format,
    status: updated.status,
    content: updated.content,
    lines: JSON.parse(updated.lines),
    updatedAt: updated.updatedAt,
  };
}

// Export subtitles
export async function exportSubtitles(subtitleId: string, userId: string, format: 'srt' | 'vtt') {
  const subtitle = await getSubtitles(subtitleId, userId);
  const lines: SubtitleLine[] = subtitle.lines;

  const content = format === 'srt' ? generateSRT(lines) : generateVTT(lines);
  const filename = `${subtitle.title.replace(/\s+/g, '_')}.${format}`;

  return {
    content,
    filename,
    mimeType: format === 'srt' ? 'text/plain' : 'text/vtt',
  };
}

// List subtitles
export async function listSubtitles(userId: string, limit: number = 50) {
  return db.subtitle.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      language: true,
      format: true,
      status: true,
      createdAt: true,
    },
  });
}

// Delete subtitles
export async function deleteSubtitles(subtitleId: string, userId: string) {
  const subtitle = await db.subtitle.findUnique({
    where: { id: subtitleId },
  });

  if (!subtitle) {
    throw new Error('Subtitles not found');
  }

  if (subtitle.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await db.subtitle.delete({
    where: { id: subtitleId },
  });
}
