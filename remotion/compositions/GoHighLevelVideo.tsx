import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface GoHighLevelVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const GoHighLevelVideo: React.FC<GoHighLevelVideoProps> = ({
  title = 'GoHighLevel Growth',
  hook = 'Scale your business with GoHighLevel',
  ...props
}) => {
  const theme = getTheme('gohighlevel');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
