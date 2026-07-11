import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface ProductivityVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const ProductivityVideo: React.FC<ProductivityVideoProps> = ({
  title = 'Productivity Hacks',
  hook = 'Work smarter, not harder',
  ...props
}) => {
  const theme = getTheme('productivity');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
