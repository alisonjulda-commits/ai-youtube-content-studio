// Remotion configuration
import { Config } from '@remotion/cli/config';

Config.setCodec('h264');
Config.setAudioBitrate('192k');
Config.setAudioCodec('aac');
Config.setCrf(18);

// Use pre-installed Chromium
if (process.env.PUPPETEER_EXECUTABLE_PATH) {
  Config.setBrowserExecutable(process.env.PUPPETEER_EXECUTABLE_PATH);
}

export const REMOTION_CONFIG = {
  fps: 30,
  durationInFrames: 1800,
  width: 1080,
  height: 1920,
  codec: 'h264',
  audioBitrate: '192k',
  audioCodec: 'aac',
};
