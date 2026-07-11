import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface YouTubeGrowthVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const YouTubeGrowthVideo: React.FC<YouTubeGrowthVideoProps> = ({
  title = 'YouTube Growth Secrets',
  hook = 'Grow your channel exponentially',
  ...props
}) => {
  const theme = getTheme('youtube-growth');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
