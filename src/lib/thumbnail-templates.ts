export interface ThumbnailTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultColors: {
    background: string;
    text: string;
    accent: string;
  };
  layout: {
    width: number;
    height: number;
  };
  sections: ThumbnailSection[];
}

export interface ThumbnailSection {
  id: string;
  type: 'text' | 'image' | 'shape' | 'emoji';
  name: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    opacity?: number;
    textAlign?: string;
  };
  content?: string;
  mutable: boolean; // Can user edit this?
}

// YouTube recommends: 1280x720, 16:9 aspect ratio, max 2MB
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

export const THUMBNAIL_TEMPLATES: ThumbnailTemplate[] = [
  {
    id: 'text-overlay',
    name: 'Text Overlay',
    description: 'Bold text with gradient overlay on solid background',
    category: 'Text Focus',
    defaultColors: {
      background: '#1a1a2e',
      text: '#ffffff',
      accent: '#00d4ff',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'bg',
        type: 'shape',
        name: 'Background',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT },
        style: { backgroundColor: '#1a1a2e' },
        mutable: false,
      },
      {
        id: 'accent-bar',
        type: 'shape',
        name: 'Accent Bar',
        position: { x: 0, y: BASE_HEIGHT - 80, width: BASE_WIDTH, height: 80 },
        style: { backgroundColor: '#00d4ff' },
        mutable: false,
      },
      {
        id: 'main-text',
        type: 'text',
        name: 'Headline',
        position: { x: 40, y: 200, width: BASE_WIDTH - 80, height: 250 },
        style: {
          fontSize: 72,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
        },
        content: 'Your Title Here',
        mutable: true,
      },
      {
        id: 'subtext',
        type: 'text',
        name: 'Subtitle',
        position: { x: 40, y: 520, width: BASE_WIDTH - 80, height: 80 },
        style: {
          fontSize: 32,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'normal',
          color: '#1a1a2e',
          textAlign: 'center',
        },
        content: 'Optional subtitle',
        mutable: true,
      },
    ],
  },

  {
    id: 'three-section',
    name: 'Three-Section',
    description: 'Three distinct content areas with icons',
    category: 'Multi-Section',
    defaultColors: {
      background: '#ffffff',
      text: '#000000',
      accent: '#ff6b6b',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'bg',
        type: 'shape',
        name: 'Background',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT },
        style: { backgroundColor: '#ffffff' },
        mutable: false,
      },
      {
        id: 'left-section',
        type: 'shape',
        name: 'Left Section',
        position: { x: 0, y: 0, width: 426, height: BASE_HEIGHT },
        style: { backgroundColor: '#ff6b6b' },
        mutable: false,
      },
      {
        id: 'main-text',
        type: 'text',
        name: 'Main Text',
        position: { x: 50, y: 250, width: 300, height: 200 },
        style: {
          fontSize: 64,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#000000',
          textAlign: 'left',
        },
        content: 'Title',
        mutable: true,
      },
      {
        id: 'subtext-1',
        type: 'text',
        name: 'Subtext 1',
        position: { x: 500, y: 150, width: 350, height: 150 },
        style: {
          fontSize: 36,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#ff6b6b',
          textAlign: 'center',
        },
        content: 'Point 1',
        mutable: true,
      },
      {
        id: 'subtext-2',
        type: 'text',
        name: 'Subtext 2',
        position: { x: 500, y: 430, width: 350, height: 150 },
        style: {
          fontSize: 36,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#ff6b6b',
          textAlign: 'center',
        },
        content: 'Point 2',
        mutable: true,
      },
    ],
  },

  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean design with centered icon and text',
    category: 'Clean',
    defaultColors: {
      background: '#f0f0f0',
      text: '#333333',
      accent: '#1e88e5',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'bg',
        type: 'shape',
        name: 'Background',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT },
        style: { backgroundColor: '#f0f0f0' },
        mutable: false,
      },
      {
        id: 'emoji',
        type: 'text',
        name: 'Icon/Emoji',
        position: { x: 400, y: 150, width: 480, height: 200 },
        style: {
          fontSize: 120,
          textAlign: 'center',
        },
        content: '📺',
        mutable: true,
      },
      {
        id: 'main-text',
        type: 'text',
        name: 'Title',
        position: { x: 100, y: 380, width: 1080, height: 200 },
        style: {
          fontSize: 56,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#333333',
          textAlign: 'center',
        },
        content: 'Clean & Simple',
        mutable: true,
      },
    ],
  },

  {
    id: 'energetic',
    name: 'Energetic',
    description: 'Colorful design with multiple text blocks',
    category: 'Vibrant',
    defaultColors: {
      background: '#ff6b6b',
      text: '#ffffff',
      accent: '#ffd93d',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'bg',
        type: 'shape',
        name: 'Background',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT },
        style: { backgroundColor: '#ff6b6b' },
        mutable: false,
      },
      {
        id: 'accent-circle-1',
        type: 'shape',
        name: 'Accent Circle 1',
        position: { x: 100, y: 100, width: 200, height: 200 },
        style: { backgroundColor: '#ffd93d', borderRadius: 100 },
        mutable: false,
      },
      {
        id: 'accent-circle-2',
        type: 'shape',
        name: 'Accent Circle 2',
        position: { x: BASE_WIDTH - 300, y: BASE_HEIGHT - 250, width: 200, height: 200 },
        style: { backgroundColor: '#6bcf7f', borderRadius: 100 },
        mutable: false,
      },
      {
        id: 'main-text',
        type: 'text',
        name: 'Main Text',
        position: { x: 100, y: 300, width: 1080, height: 150 },
        style: {
          fontSize: 68,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
        },
        content: 'AWESOME TITLE',
        mutable: true,
      },
      {
        id: 'subtext',
        type: 'text',
        name: 'Subtext',
        position: { x: 100, y: 500, width: 1080, height: 100 },
        style: {
          fontSize: 36,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'normal',
          color: '#ffd93d',
          textAlign: 'center',
        },
        content: 'Get hyped!',
        mutable: true,
      },
    ],
  },

  {
    id: 'professional',
    name: 'Professional',
    description: 'Solid background with badge',
    category: 'Business',
    defaultColors: {
      background: '#2c3e50',
      text: '#ecf0f1',
      accent: '#3498db',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'bg',
        type: 'shape',
        name: 'Background',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT },
        style: { backgroundColor: '#2c3e50' },
        mutable: false,
      },
      {
        id: 'badge-bg',
        type: 'shape',
        name: 'Badge',
        position: { x: BASE_WIDTH - 280, y: 40, width: 240, height: 240 },
        style: { backgroundColor: '#3498db', borderRadius: 120 },
        mutable: false,
      },
      {
        id: 'badge-text',
        type: 'text',
        name: 'Badge Text',
        position: { x: BASE_WIDTH - 280, y: 100, width: 240, height: 120 },
        style: {
          fontSize: 32,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
        },
        content: 'NEW',
        mutable: true,
      },
      {
        id: 'main-text',
        type: 'text',
        name: 'Title',
        position: { x: 60, y: 280, width: 900, height: 200 },
        style: {
          fontSize: 64,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#ecf0f1',
          textAlign: 'left',
        },
        content: 'Professional Title',
        mutable: true,
      },
      {
        id: 'subtext',
        type: 'text',
        name: 'Subtitle',
        position: { x: 60, y: 550, width: 900, height: 120 },
        style: {
          fontSize: 28,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'normal',
          color: '#3498db',
          textAlign: 'left',
        },
        content: 'Your subtitle here',
        mutable: true,
      },
    ],
  },

  {
    id: 'emoji-focus',
    name: 'Emoji Focus',
    description: 'Large centered emoji with text',
    category: 'Playful',
    defaultColors: {
      background: '#fff5e6',
      text: '#333333',
      accent: '#ff9f1c',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'bg',
        type: 'shape',
        name: 'Background',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT },
        style: { backgroundColor: '#fff5e6' },
        mutable: false,
      },
      {
        id: 'emoji-large',
        type: 'text',
        name: 'Large Emoji',
        position: { x: 300, y: 80, width: 680, height: 300 },
        style: {
          fontSize: 200,
          textAlign: 'center',
        },
        content: '🚀',
        mutable: true,
      },
      {
        id: 'main-text',
        type: 'text',
        name: 'Text',
        position: { x: 100, y: 420, width: 1080, height: 200 },
        style: {
          fontSize: 56,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#ff9f1c',
          textAlign: 'center',
        },
        content: 'Your Message Here',
        mutable: true,
      },
    ],
  },

  {
    id: 'split-screen',
    name: 'Split Screen',
    description: 'Two contrasting content areas',
    category: 'Comparison',
    defaultColors: {
      background: '#000000',
      text: '#ffffff',
      accent: '#00ff00',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'left-bg',
        type: 'shape',
        name: 'Left Background',
        position: { x: 0, y: 0, width: BASE_WIDTH / 2, height: BASE_HEIGHT },
        style: { backgroundColor: '#1a1a1a' },
        mutable: false,
      },
      {
        id: 'right-bg',
        type: 'shape',
        name: 'Right Background',
        position: { x: BASE_WIDTH / 2, y: 0, width: BASE_WIDTH / 2, height: BASE_HEIGHT },
        style: { backgroundColor: '#003300' },
        mutable: false,
      },
      {
        id: 'divider',
        type: 'shape',
        name: 'Divider',
        position: { x: BASE_WIDTH / 2 - 5, y: 0, width: 10, height: BASE_HEIGHT },
        style: { backgroundColor: '#00ff00' },
        mutable: false,
      },
      {
        id: 'left-text',
        type: 'text',
        name: 'Left Text',
        position: { x: 40, y: 280, width: 560, height: 160 },
        style: {
          fontSize: 48,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
        },
        content: 'Before',
        mutable: true,
      },
      {
        id: 'right-text',
        type: 'text',
        name: 'Right Text',
        position: { x: BASE_WIDTH / 2 + 40, y: 280, width: 560, height: 160 },
        style: {
          fontSize: 48,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#00ff00',
          textAlign: 'center',
        },
        content: 'After',
        mutable: true,
      },
    ],
  },

  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Gradient background with text overlay',
    category: 'Modern',
    defaultColors: {
      background: '#667eea',
      text: '#ffffff',
      accent: '#764ba2',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'bg',
        type: 'shape',
        name: 'Background',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT },
        style: { backgroundColor: '#667eea' },
        mutable: false,
      },
      {
        id: 'main-text',
        type: 'text',
        name: 'Title',
        position: { x: 100, y: 250, width: 1080, height: 220 },
        style: {
          fontSize: 72,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
        },
        content: 'Gradient Style',
        mutable: true,
      },
    ],
  },

  {
    id: 'neon',
    name: 'Neon',
    description: 'High contrast neon style',
    category: 'Modern',
    defaultColors: {
      background: '#0a0e27',
      text: '#00ff9f',
      accent: '#ff006e',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'bg',
        type: 'shape',
        name: 'Background',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT },
        style: { backgroundColor: '#0a0e27' },
        mutable: false,
      },
      {
        id: 'border-top',
        type: 'shape',
        name: 'Border Top',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: 20 },
        style: { backgroundColor: '#00ff9f' },
        mutable: false,
      },
      {
        id: 'border-bottom',
        type: 'shape',
        name: 'Border Bottom',
        position: { x: 0, y: BASE_HEIGHT - 20, width: BASE_WIDTH, height: 20 },
        style: { backgroundColor: '#ff006e' },
        mutable: false,
      },
      {
        id: 'main-text',
        type: 'text',
        name: 'Title',
        position: { x: 100, y: 250, width: 1080, height: 220 },
        style: {
          fontSize: 72,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#00ff9f',
          textAlign: 'center',
        },
        content: 'NEON STYLE',
        mutable: true,
      },
    ],
  },

  {
    id: 'flat-design',
    name: 'Flat Design',
    description: 'Flat colors with geometric shapes',
    category: 'Modern',
    defaultColors: {
      background: '#f8f9fa',
      text: '#2d3436',
      accent: '#00b894',
    },
    layout: { width: BASE_WIDTH, height: BASE_HEIGHT },
    sections: [
      {
        id: 'bg',
        type: 'shape',
        name: 'Background',
        position: { x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT },
        style: { backgroundColor: '#f8f9fa' },
        mutable: false,
      },
      {
        id: 'shape-1',
        type: 'shape',
        name: 'Shape 1',
        position: { x: 100, y: 80, width: 200, height: 200 },
        style: { backgroundColor: '#ff7675' },
        mutable: false,
      },
      {
        id: 'shape-2',
        type: 'shape',
        name: 'Shape 2',
        position: { x: 400, y: 150, width: 150, height: 150 },
        style: { backgroundColor: '#74b9ff' },
        mutable: false,
      },
      {
        id: 'shape-3',
        type: 'shape',
        name: 'Shape 3',
        position: { x: 900, y: 200, width: 250, height: 200 },
        style: { backgroundColor: '#00b894' },
        mutable: false,
      },
      {
        id: 'main-text',
        type: 'text',
        name: 'Title',
        position: { x: 100, y: 400, width: 1080, height: 200 },
        style: {
          fontSize: 64,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#2d3436',
          textAlign: 'center',
        },
        content: 'Flat & Modern',
        mutable: true,
      },
    ],
  },
];

// Get template by ID
export function getTemplate(id: string): ThumbnailTemplate | undefined {
  return THUMBNAIL_TEMPLATES.find((t) => t.id === id);
}

// Get all templates
export function getAllTemplates(): ThumbnailTemplate[] {
  return THUMBNAIL_TEMPLATES;
}

// Get templates by category
export function getTemplatesByCategory(category: string): ThumbnailTemplate[] {
  return THUMBNAIL_TEMPLATES.filter((t) => t.category === category);
}

// Get all categories
export function getCategories(): string[] {
  return Array.from(new Set(THUMBNAIL_TEMPLATES.map((t) => t.category)));
}
