/**
 * API Route: Export Pitch Deck to PowerPoint
 * Generates .pptx file using pptxgenjs
 * POST /api/export/pitch-deck
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePitchDeck } from '@/lib/pptx-export';

export async function POST(request: NextRequest) {
  try {
    // Generate PowerPoint buffer
    const pptxBuffer = generatePitchDeck();
    
    // Return as downloadable file
    return new NextResponse(pptxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': 'attachment; filename="AM-Creator-Analytics-Pitch-Deck.pptx"',
      },
    });
  } catch (error) {
    console.error('Error generating pitch deck:', error);
    return NextResponse.json(
      { error: 'Failed to generate pitch deck' },
      { status: 500 }
    );
  }
}
