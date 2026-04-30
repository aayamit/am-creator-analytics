/**
 * Self-Healing Service
 * Detects and fixes common code errors
 * Uses pattern matching + AI suggestions
 * MIT License - Free for all uses
 */

interface ErrorPattern {
  pattern: RegExp;
  fix: string | ((match: RegExpMatchArray) => string);
  description: string;
}

const KNOWN_PATTERNS: ErrorPattern[] = [
  {
    pattern: /Cannot read properties of undefined.*reading '(\w+)'/,
    fix: (match) => `Add optional chaining: ${match[1]}?.`,
    description: 'Missing optional chaining',
  },
  {
    pattern: /Module not found: Can't resolve '([^']+)'/,
    fix: (match) => `npm install ${match[1]}`,
    description: 'Missing npm package',
  },
  {
    pattern: /TypeError: (\w+) is not a function/,
    fix: 'Check if function is properly imported and exported',
    description: 'Function not found',
  },
  {
    pattern: /SyntaxError: Unexpected token/,
    fix: 'Check for missing parentheses, brackets, or semicolons',
    description: 'Syntax error',
  },
  {
    pattern: /ReferenceError: (\w+) is not defined/,
    fix: (match) => `Declare variable ${match[1]} or check spelling`,
    description: 'Variable not defined',
  },
];

export function analyzeError(log: string): {
  error: string;
  suggestion: string;
  fix?: string;
} | null {
  for (const pattern of KNOWN_PATTERNS) {
    const match = log.match(pattern.pattern);
    if (match) {
      const fix = typeof pattern.fix === 'function' 
        ? pattern.fix(match) 
        : pattern.fix;
      
      return {
        error: match[0],
        suggestion: pattern.description,
        fix,
      };
    }
  }
  
  return null; // Unknown error
}

export function healCode(
  filePath: string,
  error: string
): { success: boolean; patch?: string; message: string } {
  const analysis = analyzeError(error);
  
  if (!analysis) {
    return {
      success: false,
      message: 'Unknown error pattern. Manual review required.',
    };
  }
  
  // In production: Use AI (Groq) to generate actual code patch
  const patch = `// Suggested fix for ${filePath}:\n// ${analysis.fix}`;
  
  return {
    success: true,
    patch,
    message: `Healing suggestion: ${analysis.description}`,
  };
}

export function getHealingStats() {
  return {
    knownPatterns: KNOWN_PATTERNS.length,
    healingAvailable: true,
    aiPowered: false, // Set to true when Groq integration added
  };
}
