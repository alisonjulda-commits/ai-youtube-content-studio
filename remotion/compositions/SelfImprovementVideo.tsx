import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface SelfImprovementVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const SelfImprovementVideo: React.FC<SelfImprovementVideoProps> = ({
  title = 'Self Improvement Journey',
  hook = 'Become the best version of yourself',
  ...props
}) => {
  const theme = getTheme('self-improvement');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
