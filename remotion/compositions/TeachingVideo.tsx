import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface TeachingVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const TeachingVideo: React.FC<TeachingVideoProps> = ({
  title = 'Teaching Excellence',
  hook = 'Educate and inspire your audience',
  ...props
}) => {
  const theme = getTheme('teaching');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
