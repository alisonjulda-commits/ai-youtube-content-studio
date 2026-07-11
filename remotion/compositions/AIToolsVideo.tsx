import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface AIToolsVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const AIToolsVideo: React.FC<AIToolsVideoProps> = ({
  title = 'AI Tools for Success',
  hook = 'Master the tools that change everything',
  ...props
}) => {
  const theme = getTheme('ai-tools');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
