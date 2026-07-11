import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface VirtualAssistantVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const VirtualAssistantVideo: React.FC<VirtualAssistantVideoProps> = ({
  title = 'Virtual Assistant Skills',
  hook = 'Master the art of virtual assistance',
  ...props
}) => {
  const theme = getTheme('virtual-assistant');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
