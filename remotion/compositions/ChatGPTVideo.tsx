import React from 'react';
import { VideoTemplate, VideoTemplateProps } from './VideoTemplate';
import { getTheme } from '../themes';

export interface ChatGPTVideoProps
  extends Omit<VideoTemplateProps, 'theme'> {
  title?: string;
  hook?: string;
}

export const ChatGPTVideo: React.FC<ChatGPTVideoProps> = ({
  title = 'ChatGPT Secrets',
  hook = 'Transform your workflow with ChatGPT',
  ...props
}) => {
  const theme = getTheme('chatgpt');
  return <VideoTemplate {...props} title={title} hook={hook} theme={theme} />;
};
