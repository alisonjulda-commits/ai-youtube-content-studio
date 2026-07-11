import { ThumbnailTemplate, ThumbnailSection, getTemplate } from './thumbnail-templates';
import * as fs from 'fs';
import * as path from 'path';
import { db } from './db';

export interface ThumbnailDesign {
  id?: string;
  templateId: string;
  title: string;
  colors: {
    background: string;
    text: string;
    accent: string;
  };
  textOverrides: Record<string, string>;
  createdAt?: Date;
}

// Generate SVG from template and design
export function generateThumbnailSVG(design: ThumbnailDesign): string {
  const template = getTemplate(design.templateId);
  if (!template) {
    throw new Error(`Template not found: ${design.templateId}`);
  }

  const { width, height } = template.layout;
  const colors = {
    ...template.defaultColors,
    ...design.colors,
  };

  const sections = template.sections.map((section) => {
    let sectionCopy = { ...section };

    // Override text content if provided
    if (section.mutable && design.textOverrides[section.id]) {
      sectionCopy = {
        ...sectionCopy,
        content: design.textOverrides[section.id],
      };
    }

    // Apply color overrides
    if (section.style) {
      sectionCopy = {
        ...sectionCopy,
        style: {
          ...section.style,
          backgroundColor:
            section.type === 'shape'
              ? section.style.backgroundColor === '#1a1a2e' ||
                section.style.backgroundColor === template.defaultColors.background
                ? colors.background
                : section.style.backgroundColor === template.defaultColors.accent
                ? colors.accent
                : section.style.backgroundColor
              : undefined,
          color:
            section.type === 'text'
              ? section.style.color === template.defaultColors.text
                ? colors.text
                : section.style.color
              : undefined,
        },
      };
    }

    return sectionCopy;
  });

  return generateSVG(width, height, sections);
}

// Generate SVG markup
function generateSVG(width: number, height: number, sections: ThumbnailSection[]): string {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

  for (const section of sections) {
    if (section.type === 'shape') {
      svg += generateShapeSVG(section);
    } else if (section.type === 'text') {
      svg += generateTextSVG(section);
    }
  }

  svg += '</svg>';
  return svg;
}

// Generate shape SVG element
function generateShapeSVG(section: ThumbnailSection): string {
  const { x, y, width, height } = section.position;
  const style = section.style || {};
  const backgroundColor = style.backgroundColor || '#ffffff';
  const borderRadius = style.borderRadius || 0;

  if (borderRadius > 0) {
    return `<circle cx="${x + width / 2}" cy="${y + height / 2}" r="${borderRadius}" fill="${backgroundColor}" />`;
  }

  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${backgroundColor}" />`;
}

// Generate text SVG element
function generateTextSVG(section: ThumbnailSection): string {
  const { x, y, width, height } = section.position;
  const style = section.style || {};
  const fontSize = style.fontSize || 32;
  const fontFamily = style.fontFamily || 'Arial, sans-serif';
  const fontWeight = style.fontWeight || 'normal';
  const color = style.color || '#000000';
  const textAlign = style.textAlign || 'left';
  const content = escapeXml(section.content || '');

  const textAnchor =
    textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start';
  const textX = textAlign === 'center' ? x + width / 2 : textAlign === 'right' ? x + width : x;
  const textY = y + height / 2;

  return `<text x="${textX}" y="${textY}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${color}" text-anchor="${textAnchor}" dominant-baseline="middle" word-wrap="break-word">${content}</text>`;
}

// Escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Save thumbnail design to database
export async function saveThumbnailDesign(
  userId: string,
  design: Omit<ThumbnailDesign, 'id' | 'createdAt'>,
  videoIdeaId?: string
): Promise<string> {
  // Validate template exists
  const template = getTemplate(design.templateId);
  if (!template) {
    throw new Error(`Template not found: ${design.templateId}`);
  }

  // Save to database
  const thumbnail = await db.thumbnailDesign.create({
    data: {
      userId,
      videoIdeaId,
      templateId: design.templateId,
      title: design.title,
      colors: JSON.stringify(design.colors),
      textOverrides: JSON.stringify(design.textOverrides),
      svgContent: generateThumbnailSVG(design),
      status: 'draft',
    },
  });

  return thumbnail.id;
}

// Get thumbnail design
export async function getThumbnailDesign(designId: string, userId: string) {
  const design = await db.thumbnailDesign.findUnique({
    where: { id: designId },
  });

  if (!design) {
    throw new Error('Design not found');
  }

  if (design.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return {
    id: design.id,
    templateId: design.templateId,
    title: design.title,
    colors: JSON.parse(design.colors),
    textOverrides: JSON.parse(design.textOverrides),
    status: design.status,
    createdAt: design.createdAt,
    svgContent: design.svgContent,
  };
}

// Update thumbnail design
export async function updateThumbnailDesign(
  designId: string,
  userId: string,
  updates: Partial<Omit<ThumbnailDesign, 'id' | 'createdAt'>>
) {
  const design = await db.thumbnailDesign.findUnique({
    where: { id: designId },
  });

  if (!design) {
    throw new Error('Design not found');
  }

  if (design.userId !== userId) {
    throw new Error('Unauthorized');
  }

  const currentDesign = {
    templateId: design.templateId,
    title: design.title,
    colors: JSON.parse(design.colors),
    textOverrides: JSON.parse(design.textOverrides),
  };

  const updatedDesign = { ...currentDesign, ...updates };
  const svgContent = generateThumbnailSVG(updatedDesign);

  const updated = await db.thumbnailDesign.update({
    where: { id: designId },
    data: {
      title: updatedDesign.title,
      colors: JSON.stringify(updatedDesign.colors),
      textOverrides: JSON.stringify(updatedDesign.textOverrides),
      svgContent,
    },
  });

  return {
    id: updated.id,
    templateId: updated.templateId,
    title: updated.title,
    colors: JSON.parse(updated.colors),
    textOverrides: JSON.parse(updated.textOverrides),
    status: updated.status,
    createdAt: updated.createdAt,
    svgContent: updated.svgContent,
  };
}

// List thumbnail designs
export async function listThumbnailDesigns(userId: string, limit: number = 50) {
  return db.thumbnailDesign.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      templateId: true,
      title: true,
      status: true,
      createdAt: true,
    },
  });
}

// Delete thumbnail design
export async function deleteThumbnailDesign(designId: string, userId: string) {
  const design = await db.thumbnailDesign.findUnique({
    where: { id: designId },
  });

  if (!design) {
    throw new Error('Design not found');
  }

  if (design.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await db.thumbnailDesign.delete({
    where: { id: designId },
  });
}

// Export thumbnail as PNG (requires server-side rendering)
// For now, return SVG and let client handle rendering
export async function exportThumbnailSVG(designId: string, userId: string): Promise<string> {
  const design = await getThumbnailDesign(designId, userId);
  return design.svgContent;
}

// Get SVG preview URL
export function getSVGDataUrl(svgContent: string): string {
  const encoded = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}
