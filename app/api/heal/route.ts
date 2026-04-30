/**
 * Self-Healing API
 * POST /api/heal
 * Analyzes error and suggests fix
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeError, healCode } from "@/lib/self-healing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { errorLog, filePath } = body;
    
    if (!errorLog) {
      return NextResponse.json(
        { error: 'errorLog is required' },
        { status: 400 }
      );
    }
    
    // Analyze the error
    const analysis = analyzeError(errorLog);
    
    if (!analysis) {
      return NextResponse.json({
        success: false,
        message: 'Could not identify error pattern',
        suggestion: 'Try using AI-powered debugging (Groq)',
        autoFixAvailable: false,
      });
    }
    
    // Generate healing suggestion
    const healing = filePath 
      ? healCode(filePath, errorLog)
      : { 
          success: true, 
          message: analysis.suggestion, 
          patch: analysis.fix 
        };
    
    return NextResponse.json({
      success: true,
      error: analysis.error,
      suggestion: analysis.suggestion,
      patch: healing.patch,
      autoFixAvailable: true,
      message: 'Healing suggestion generated',
    });
  } catch (error) {
    console.error('Healing error:', error);
    return NextResponse.json(
      { error: 'Failed to heal code' },
      { status: 500 }
    );
  }
}
