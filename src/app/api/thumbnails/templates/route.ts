import { getAllTemplates, getCategories } from '@/lib/thumbnail-templates';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');

    if (category) {
      const { getTemplatesByCategory } = await import('@/lib/thumbnail-templates');
      const templates = getTemplatesByCategory(category);
      return NextResponse.json({
        category,
        count: templates.length,
        templates: templates.map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          category: t.category,
          defaultColors: t.defaultColors,
        })),
      });
    }

    const templates = getAllTemplates();
    const categories = getCategories();

    return NextResponse.json({
      total: templates.length,
      categories,
      templates: templates.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        defaultColors: t.defaultColors,
      })),
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { error: 'Failed to get templates' },
      { status: 500 }
    );
  }
}
