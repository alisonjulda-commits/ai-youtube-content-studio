import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface VoiceConfig {
  voice: string; // e.g., 'en-us+f1' for female US English
  speed: number; // 50-200, default 150
  pitch: number; // 0-100, default 50
}

const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  voice: 'en-us+f1', // Female voice with good English pronunciation
  speed: 150,
  pitch: 50,
};

export async function generateVoiceover(
  text: string,
  outputPath: string,
  voiceConfig: VoiceConfig = DEFAULT_VOICE_CONFIG
): Promise<{ path: string; duration: number }> {
  try {
    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Generate TTS with espeak-ng
    const rawWavPath = outputPath.replace('.mp3', '.raw.wav');

    await execAsync(
      `espeak-ng -v "${voiceConfig.voice}" -s ${voiceConfig.speed} -p ${voiceConfig.pitch} -w "${rawWavPath}" "${text}"`
    );

    // Process and enhance audio with FFmpeg
    await execAsync(
      `ffmpeg -nostdin -y -loglevel error -i "${rawWavPath}" ` +
      `-af "highpass=f=85:poles=2,` +
      `treble=g=5:f=3500,` +
      `bass=g=2:f=200,` +
      `equalizer=f=6000:t=q:width_type=h:width=0.8:g=-2,` +
      `compand=attacks=0.04:decays=0.25:points=-80/-80|-50/-30|-20/-15|0/0:soft-knee=8:gain=4:volume=-0:delay=0.04,` +
      `aecho=0.4:0.08:60:0.35,` +
      `loudnorm=I=-13:TP=-1:LRA=8" ` +
      `-ar 44100 -ac 1 -b:a 128k "${outputPath}" < /dev/null`
    );

    // Get duration
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputPath}"`
    );
    const duration = parseFloat(stdout);

    // Clean up raw file
    await fs.unlink(rawWavPath).catch(() => {});

    return { path: outputPath, duration };
  } catch (error) {
    console.error('Failed to generate voiceover:', error);
    throw error;
  }
}

export async function generateMultipleVoiceovers(
  sections: Array<{ id: string; text: string }>,
  outputDir: string,
  voiceConfig?: VoiceConfig
): Promise<Record<string, { path: string; duration: number }>> {
  const results: Record<string, { path: string; duration: number }> = {};

  for (const section of sections) {
    const outputPath = path.join(outputDir, `${section.id}.mp3`);
    try {
      results[section.id] = await generateVoiceover(section.text, outputPath, voiceConfig);
    } catch (error) {
      console.error(`Failed to generate voiceover for ${section.id}:`, error);
      throw error;
    }
  }

  return results;
}

export async function getVoiceoverDuration(filePath: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    return parseFloat(stdout);
  } catch (error) {
    console.error('Failed to get voiceover duration:', error);
    throw error;
  }
}
