import React from 'react';
import { Composition } from 'remotion';
import { BiblicalSelfCareVideo, BiblicalSelfCareVideoProps } from './compositions/BiblicalSelfCareVideo';
import { AIToolsVideo, AIToolsVideoProps } from './compositions/AIToolsVideo';
import { ClaudeAIVideo, ClaudeAIVideoProps } from './compositions/ClaudeAIVideo';
import { ChatGPTVideo, ChatGPTVideoProps } from './compositions/ChatGPTVideo';
import { GoHighLevelVideo, GoHighLevelVideoProps } from './compositions/GoHighLevelVideo';
import { CanvaVideo, CanvaVideoProps } from './compositions/CanvaVideo';
import { TeachingVideo, TeachingVideoProps } from './compositions/TeachingVideo';
import { VirtualAssistantVideo, VirtualAssistantVideoProps } from './compositions/VirtualAssistantVideo';
import { ProductivityVideo, ProductivityVideoProps } from './compositions/ProductivityVideo';
import { SelfImprovementVideo, SelfImprovementVideoProps } from './compositions/SelfImprovementVideo';
import { YouTubeGrowthVideo, YouTubeGrowthVideoProps } from './compositions/YouTubeGrowthVideo';

const defaultTemplateProps = {
  scriptSections: [],
  musicUrl: '/music.mp3',
  voiceoverUrls: {},
  showCategoryIcon: true,
  showBranding: true,
};

const defaultProps: BiblicalSelfCareVideoProps = {
  title: 'Self-Care is I Care',
  hook: 'Your health is a gift from God.',
  scriptSections: [],
  musicUrl: '/music.mp3',
  voiceoverUrls: {},
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Biblical Self Care (Legacy) */}
      <Composition
        id="BiblicalSelfCare"
        component={BiblicalSelfCareVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />

      {/* AI Tools Category */}
      <Composition
        id="AITools"
        component={AIToolsVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'AI Tools for Success',
          hook: 'Master the tools that change everything',
        } as AIToolsVideoProps}
      />

      {/* Claude AI Category */}
      <Composition
        id="ClaudeAI"
        component={ClaudeAIVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'Claude AI Mastery',
          hook: 'Unlock AI productivity with Claude',
        } as ClaudeAIVideoProps}
      />

      {/* ChatGPT Category */}
      <Composition
        id="ChatGPT"
        component={ChatGPTVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'ChatGPT Secrets',
          hook: 'Transform your workflow with ChatGPT',
        } as ChatGPTVideoProps}
      />

      {/* GoHighLevel Category */}
      <Composition
        id="GoHighLevel"
        component={GoHighLevelVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'GoHighLevel Growth',
          hook: 'Scale your business with GoHighLevel',
        } as GoHighLevelVideoProps}
      />

      {/* Canva Category */}
      <Composition
        id="Canva"
        component={CanvaVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'Canva Design Magic',
          hook: 'Create stunning designs in minutes',
        } as CanvaVideoProps}
      />

      {/* Teaching Category */}
      <Composition
        id="Teaching"
        component={TeachingVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'Teaching Excellence',
          hook: 'Educate and inspire your audience',
        } as TeachingVideoProps}
      />

      {/* Virtual Assistant Category */}
      <Composition
        id="VirtualAssistant"
        component={VirtualAssistantVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'Virtual Assistant Skills',
          hook: 'Master the art of virtual assistance',
        } as VirtualAssistantVideoProps}
      />

      {/* Productivity Category */}
      <Composition
        id="Productivity"
        component={ProductivityVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'Productivity Hacks',
          hook: 'Work smarter, not harder',
        } as ProductivityVideoProps}
      />

      {/* Self Improvement Category */}
      <Composition
        id="SelfImprovement"
        component={SelfImprovementVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'Self Improvement Journey',
          hook: 'Become the best version of yourself',
        } as SelfImprovementVideoProps}
      />

      {/* YouTube Growth Category */}
      <Composition
        id="YouTubeGrowth"
        component={YouTubeGrowthVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultTemplateProps,
          title: 'YouTube Growth Secrets',
          hook: 'Grow your channel exponentially',
        } as YouTubeGrowthVideoProps}
      />
    </>
  );
};
