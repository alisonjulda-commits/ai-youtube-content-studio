/**
 * Custom Remotion render script that bypasses Chrome download
 */
const { renderMedia } = require('@remotion/renderer');
const path = require('path');

// Set environment to use pre-installed browser
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
process.env.PUPPETEER_EXECUTABLE_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const compositions = [
  {
    id: 'SelfCareNotSelfish_Main',
    filename: '2026-07-12_SelfCareNotSelfish_v1.mp4',
    duration: 16200,
  },
  {
    id: 'Short_OilChange',
    filename: '2026-07-12_Short_OilChange_v1.mp4',
    duration: 900,
  },
  {
    id: 'Short_EmptyCupTest',
    filename: '2026-07-12_Short_EmptyCupTest_v1.mp4',
    duration: 900,
  },
  {
    id: 'Short_SayNoChallenge',
    filename: '2026-07-12_Short_SayNoChallenge_v1.mp4',
    duration: 750,
  },
  {
    id: 'Short_TenMinutes',
    filename: '2026-07-12_Short_TenMinutes_v1.mp4',
    duration: 1050,
  },
  {
    id: 'Short_TheVerse',
    filename: '2026-07-12_Short_TheVerse_v1.mp4',
    duration: 900,
  },
];

async function renderAll() {
  console.log('Starting render with system browser...\n');

  for (const comp of compositions) {
    try {
      console.log(`Rendering ${comp.id}...`);
      const output = path.join('out', comp.filename);

      await renderMedia({
        composition: comp,
        serveUrl: 'http://localhost:3000',
        codec: 'h264',
        audioBitrate: '192k',
        audioCodec: 'aac',
        concurrency: 2,
        outputLocation: output,
        puppeteerInstance: undefined,
        browserExecutable: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      });

      console.log(`✓ ${comp.id} saved to ${output}\n`);
    } catch (error) {
      console.error(`✗ Failed to render ${comp.id}:`, error.message, '\n');
    }
  }
}

renderAll().catch(console.error);
