import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface CanvaVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const CanvaVideo: React.FC<CanvaVideoProps> = ({
  title = 'Canva Design Magic',
  hook = 'Create stunning designs in minutes',
  ...props
}) => {
  const theme = getTheme('canva');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
