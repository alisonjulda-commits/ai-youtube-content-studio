export const CATEGORIES = [
  'AI Tools',
  'Claude AI',
  'ChatGPT',
  'GoHighLevel',
  'Canva',
  'Teaching',
  'Virtual Assistant',
  'Productivity',
  'Self Improvement',
  'YouTube Growth',
];

export const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
];

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'hard', label: 'Hard', color: 'bg-red-500' },
];

export const STATUSES = [
  { value: 'idea', label: 'Idea', color: 'bg-gray-500' },
  { value: 'planning', label: 'Planning', color: 'bg-blue-500' },
  { value: 'scripting', label: 'Scripting', color: 'bg-purple-500' },
  { value: 'recording', label: 'Recording', color: 'bg-orange-500' },
  { value: 'editing', label: 'Editing', color: 'bg-pink-500' },
  { value: 'published', label: 'Published', color: 'bg-green-500' },
];

export const PROMPT_CATEGORIES = [
  'Script Writing',
  'SEO Optimization',
  'Thumbnail Design',
  'Social Media',
  'Audience Engagement',
  'Content Ideas',
  'Video Hooks',
  'Call to Action',
  'Storytelling',
  'Research',
];

export const DEFAULT_PROMPTS = [
  {
    title: 'Engaging Hook Generator',
    category: 'Video Hooks',
    content: `Create an engaging hook for a YouTube video about {topic}. The hook should be attention-grabbing, clear, and make viewers want to watch more. Keep it to 1-2 sentences maximum.`,
  },
  {
    title: 'SEO Title Generator',
    category: 'SEO Optimization',
    content: `Generate 5 SEO-optimized YouTube titles for a video about {topic}. Each title should be between 50-60 characters, include the main keyword, and be compelling enough to encourage clicks.`,
  },
  {
    title: 'Script Outline',
    category: 'Script Writing',
    content: `Create a detailed outline for a {duration}-minute script about {topic}. Include: Hook, Introduction, Main Points (3-5), Examples/Stories, Call to Action, and Conclusion.`,
  },
];

export const CATEGORY_TEMPLATES = [
  {
    category: 'AI Tools',
    description: 'Overview and tutorial for AI tools and applications',
    scriptTemplate: {
      hook: 'Just discovered an AI tool that changed my productivity game...',
      intro: 'In this video, I\'m going to show you {toolName} and how it can {benefit}.',
      body: 'Here are the key features and benefits of {toolName}:',
      examples: 'Let me show you exactly how to use {toolName} in your workflow...',
      cta: 'Try {toolName} yourself and let me know in the comments what you create with it.',
      outro: 'If you found this helpful, please like and subscribe for more AI tools and productivity tips.',
    },
    prompts: [
      {
        title: '{toolName} Hook Generator',
        category: 'Video Hooks',
        content: `Create an engaging hook for a YouTube video about the AI tool {toolName}. The hook should highlight the transformation or benefit it provides. Keep it to 1-2 sentences maximum.`,
      },
      {
        title: '{toolName} Tutorial Outline',
        category: 'Script Writing',
        content: `Create a {duration}-minute tutorial script outline for {toolName}. Structure: Hook, What It Is, Key Features (3-4), Live Demo, Use Cases, Call to Action, Outro.`,
      },
    ],
  },
  {
    category: 'Claude AI',
    description: 'Tutorials and tips for using Claude AI',
    scriptTemplate: {
      hook: 'Claude AI just helped me {achievement}...',
      intro: 'Welcome back! Today I\'m sharing a powerful Claude AI technique that will {benefit}.',
      body: 'Let me break down exactly how to use Claude for {useCase}...',
      examples: 'Here are real examples of how I use Claude in my daily workflow...',
      cta: 'Try this Claude technique today and share your results in the comments.',
      outro: 'Thanks for watching! Subscribe for more Claude AI and AI tools content.',
    },
    prompts: [
      {
        title: 'Claude AI Tutorial Hook',
        category: 'Video Hooks',
        content: `Create an engaging hook about Claude AI and {topic}. Focus on transformation or efficiency gains. Keep it to 1-2 sentences.`,
      },
      {
        title: 'Claude Workflow Guide',
        category: 'Script Writing',
        content: `Create a {duration}-minute script for teaching a Claude AI workflow about {topic}. Include: Hook, Problem It Solves, Step-by-Step Guide, Real Examples, Tips & Tricks, CTA.`,
      },
    ],
  },
  {
    category: 'ChatGPT',
    description: 'ChatGPT tips, tricks, and tutorial content',
    scriptTemplate: {
      hook: 'ChatGPT can now {capability} and here\'s how to use it...',
      intro: 'In this video, I\'m showing you a ChatGPT technique most people don\'t know about.',
      body: 'The key to getting better results from ChatGPT is knowing how to {technique}...',
      examples: 'Here are my best ChatGPT prompts and how they work...',
      cta: 'Try these ChatGPT prompts and share your results in the comments below.',
      outro: 'Don\'t forget to subscribe for more ChatGPT tips and AI content every week.',
    },
    prompts: [
      {
        title: 'ChatGPT Prompt Engineering',
        category: 'Script Writing',
        content: `Write a {duration}-minute script about ChatGPT prompt engineering for {topic}. Include: Hook, Common Mistakes, Effective Techniques, Examples, Advanced Tips, CTA.`,
      },
    ],
  },
  {
    category: 'GoHighLevel',
    description: 'GoHighLevel platform tutorials and strategies',
    scriptTemplate: {
      hook: 'If you\'re using GoHighLevel, you need to know about {feature}...',
      intro: 'GoHighLevel can automate your {process}, and here\'s exactly how to set it up.',
      body: 'Let me walk you through the {feature} setup step-by-step...',
      examples: 'Here\'s how my clients use this to generate {result}...',
      cta: 'Click the link below to start your GoHighLevel free trial and try this strategy.',
      outro: 'Subscribe for more GoHighLevel tutorials and digital marketing strategies.',
    },
    prompts: [
      {
        title: 'GoHighLevel {feature} Tutorial',
        category: 'Script Writing',
        content: `Create a {duration}-minute tutorial script for GoHighLevel {feature}. Include: Hook, Problem Solved, Setup Steps, Best Practices, Common Mistakes, CTA.`,
      },
    ],
  },
  {
    category: 'Canva',
    description: 'Canva design tips and creative projects',
    scriptTemplate: {
      hook: 'I created {design} in Canva in just {minutes} minutes...',
      intro: 'Canva is perfect for creating {design_type} without design skills.',
      body: 'Here\'s my complete process for creating {design_type} in Canva...',
      examples: 'Let me show you the templates and tools I use for {design_type}...',
      cta: 'Try Canva today and create your own {design_type} using my method.',
      outro: 'Subscribe for more Canva tutorials and design tips.',
    },
    prompts: [
      {
        title: 'Canva Design Tutorial',
        category: 'Script Writing',
        content: `Write a {duration}-minute script teaching how to create {design_type} in Canva. Include: Hook, Tools Needed, Step-by-Step Process, Design Tips, Common Mistakes, CTA.`,
      },
    ],
  },
  {
    category: 'Teaching',
    description: 'Educational content and teaching tutorials',
    scriptTemplate: {
      hook: 'I\'m teaching you {skill} and it\'s easier than you think...',
      intro: 'In this video, I\'m breaking down {topic} into simple, digestible lessons.',
      body: 'The key concepts you need to understand about {topic} are...',
      examples: 'Here are real-world examples of {topic} in action...',
      cta: 'Follow along with the exercises in the description and share your progress.',
      outro: 'If you found this helpful, please like, subscribe, and share with someone learning {topic}.',
    },
    prompts: [
      {
        title: 'Teaching {topic} Script',
        category: 'Script Writing',
        content: `Create a {duration}-minute educational script about {topic}. Include: Hook, Key Concepts, Simplified Explanations, Real Examples, Practice Exercises, CTA.`,
      },
    ],
  },
  {
    category: 'Virtual Assistant',
    description: 'Virtual assistant skills, tools, and strategies',
    scriptTemplate: {
      hook: 'As a virtual assistant, I discovered {strategy} that increased my earnings...',
      intro: 'Today I\'m sharing my best virtual assistant {area} that clients love.',
      body: 'The {strategy} process that virtual assistants should know about...',
      examples: 'Here\'s how my clients benefited from {strategy}...',
      cta: 'If you\'re a virtual assistant, try this {strategy} and let me know your results.',
      outro: 'Subscribe for more virtual assistant tips and client management strategies.',
    },
    prompts: [
      {
        title: 'VA Skills {topic} Guide',
        category: 'Script Writing',
        content: `Write a {duration}-minute script for virtual assistants about {topic}. Include: Hook, Skill Overview, Step-by-Step Process, Client Benefits, Time-Saving Tips, CTA.`,
      },
    ],
  },
  {
    category: 'Productivity',
    description: 'Productivity tools, systems, and optimization',
    scriptTemplate: {
      hook: 'This {tool} increased my productivity by {percent}%...',
      intro: 'I\'ve tested every productivity {category} and here\'s the best approach.',
      body: 'My complete {topic} system that saves {time_unit} every day...',
      examples: 'Here\'s how this {tool} has transformed my workflow...',
      cta: 'Implement this {topic} system in your life today using the resources in the description.',
      outro: 'Subscribe for more productivity hacks and system optimization videos.',
    },
    prompts: [
      {
        title: 'Productivity {topic} Guide',
        category: 'Script Writing',
        content: `Create a {duration}-minute script about productivity {topic}. Include: Hook, Problem Addressed, Solution Overview, Implementation Steps, Results, CTA.`,
      },
    ],
  },
  {
    category: 'Self Improvement',
    description: 'Personal development, mindset, and growth content',
    scriptTemplate: {
      hook: 'This one change transformed my {area}...',
      intro: 'I\'m sharing the mindset shift that changed everything about {topic}.',
      body: 'Here\'s the complete framework for {self_improvement_area}...',
      examples: 'These are the specific results I\'ve seen from {strategy}...',
      cta: 'Start implementing this today and share your progress in the comments.',
      outro: 'Subscribe for more personal development content and transformation stories.',
    },
    prompts: [
      {
        title: 'Self Improvement {topic} Talk',
        category: 'Script Writing',
        content: `Write a {duration}-minute motivational script about {topic}. Include: Hook, The Problem, The Solution, Actionable Steps, Success Stories, CTA, Inspirational Outro.`,
      },
    ],
  },
  {
    category: 'YouTube Growth',
    description: 'YouTube strategy, algorithm, and growth hacks',
    scriptTemplate: {
      hook: 'YouTube\'s algorithm just favors {strategy} and here\'s proof...',
      intro: 'If you want to grow your YouTube channel, you need to know about {topic}.',
      body: 'The YouTube algorithm responds to {factor} which is why {strategy} works...',
      examples: 'Here\'s how I used {strategy} to go from {before} to {after} subscribers...',
      cta: 'Try this {strategy} on your channel and let me know your results in the comments.',
      outro: 'Subscribe and turn on notifications to never miss YouTube growth strategies.',
    },
    prompts: [
      {
        title: 'YouTube Growth {strategy} Guide',
        category: 'Script Writing',
        content: `Create a {duration}-minute YouTube strategy script about {topic}. Include: Hook, Algorithm Insights, Proven {strategy}, Case Studies, Implementation Steps, CTA.`,
      },
    ],
  },
];

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl/Cmd + S', action: 'Save' },
  { key: 'Ctrl/Cmd + K', action: 'Search' },
  { key: 'Ctrl/Cmd + /', action: 'Command Palette' },
  { key: 'Escape', action: 'Close Modal' },
];
