import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Some sandboxed/CI environments block Remotion's automatic headless-Chrome
// download. If Chrome/Chromium is already installed there, point at it via
// this env var instead of editing this file.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
