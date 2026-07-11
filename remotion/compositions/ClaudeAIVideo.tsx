import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface ClaudeAIVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const ClaudeAIVideo: React.FC<ClaudeAIVideoProps> = ({
  title = 'Claude AI Mastery',
  hook = 'Unlock AI productivity with Claude',
  ...props
}) => {
  const theme = getTheme('claude-ai');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
