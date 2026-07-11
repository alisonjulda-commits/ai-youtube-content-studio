import { exportThumbnailSVG } from '@/lib/thumbnail-generator';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { designId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { designId } = params;
    const format = request.nextUrl.searchParams.get('format') || 'svg';

    const svgContent = await exportThumbnailSVG(designId, userId);

    if (format === 'svg') {
      return new NextResponse(svgContent, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': 'attachment; filename="thumbnail.svg"',
        },
      });
    }

    if (format === 'dataUrl') {
      const encoded = Buffer.from(svgContent).toString('base64');
      const dataUrl = `data:image/svg+xml;base64,${encoded}`;
      return NextResponse.json({ dataUrl });
    }

    // PNG export would require server-side rendering
    // For now, return SVG and let client convert if needed
    return NextResponse.json({
      error: 'PNG export requires additional setup',
      suggestion: 'Use format=svg or format=dataUrl for now',
    });
  } catch (error) {
    console.error('Export error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to export design',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}
