import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export async function generateBackgroundMusic(
  durationSeconds: number,
  outputPath: string
): Promise<{ path: string; duration: number }> {
  try {
    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Create professional lo-fi hip-hop inspired instrumental
    // Low bass pad (A note, 55Hz) - calm foundation
    // Mid-range warmth (A chord: 110, 165Hz) - smooth pad
    // High shimmer (piano-like overtones at 440Hz)

    await execAsync(
      `ffmpeg -nostdin -y -loglevel error ` +
      `-f lavfi -i "sine=frequency=55:duration=${durationSeconds}" ` +
      `-f lavfi -i "sine=frequency=110:duration=${durationSeconds}" ` +
      `-f lavfi -i "sine=frequency=165:duration=${durationSeconds}" ` +
      `-f lavfi -i "sine=frequency=440:duration=${durationSeconds}" ` +
      `-filter_complex "[0:a]volume=0.3,lowpass=f=200[bass];` +
      `[1:a][2:a]amix=inputs=2:weights=0.6 0.4[mid];` +
      `[mid]volume=0.5,equalizer=f=500:t=h:width_type=h:width=0.6:g=2[mid_eq];` +
      `[3:a]volume=0.2,highpass=f=2000,treble=g=2:f=8000[high];` +
      `[bass][mid_eq][high]amix=inputs=3:weights=0.3 0.5 0.2,` +
      `afade=t=in:d=0.5,` +
      `afade=t=out:st=${Math.max(0, durationSeconds - 0.5)}:d=0.5,` +
      `loudnorm=I=-17:TP=-2:LRA=10" ` +
      `-ar 44100 -ac 2 -b:a 192k "${outputPath}" < /dev/null`
    );

    return { path: outputPath, duration: durationSeconds };
  } catch (error) {
    console.error('Failed to generate background music:', error);
    throw error;
  }
}

export async function getAudioDuration(filePath: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    return parseFloat(stdout);
  } catch (error) {
    console.error('Failed to get audio duration:', error);
    throw error;
  }
}

export async function mixAudioTracks(
  backgroundMusicPath: string,
  voiceoverPaths: string[],
  outputPath: string,
  backgroundVolume: number = 0.3,
  voiceoverVolume: number = 0.8
): Promise<{ path: string; duration: number }> {
  try {
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Build ffmpeg filter complex for mixing multiple voiceovers with background music
    let inputArgs = `-i "${backgroundMusicPath}"`;
    let filterArgs = '[0:a]volume=' + backgroundVolume + '[music]';

    for (let i = 0; i < voiceoverPaths.length; i++) {
      inputArgs += ` -i "${voiceoverPaths[i]}"`;
      filterArgs += `;[${i + 1}:a]volume=${voiceoverVolume}[vo${i}]`;
    }

    // Mix all audio tracks
    let mixFilter = '[music]';
    for (let i = 0; i < voiceoverPaths.length; i++) {
      mixFilter += `[vo${i}]`;
    }
    filterArgs += `;${mixFilter}amix=inputs=${voiceoverPaths.length + 1}:weights=${
      [backgroundVolume, ...voiceoverPaths.map(() => voiceoverVolume)].join(' ')
    },loudnorm=I=-13:TP=-1:LRA=8[out]`;

    await execAsync(
      `ffmpeg -nostdin -y -loglevel error ${inputArgs} ` +
      `-filter_complex "${filterArgs}" ` +
      `-map "[out]" -ar 44100 -ac 2 -b:a 192k "${outputPath}" < /dev/null`
    );

    const duration = await getAudioDuration(outputPath);
    return { path: outputPath, duration };
  } catch (error) {
    console.error('Failed to mix audio:', error);
    throw error;
  }
}
