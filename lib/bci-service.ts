/**
 * BCI Service (Mock)
 * Simulates brain-computer interface
 * In production: Connect to OpenBCI or Neuralink API
 * MIT License - Free for all uses
 */

export type ThoughtCommand = 
  | 'NAVIGATE_DASHBOARD'
  | 'CREATE_CAMPAIGN'
  | 'VIEW_CREATORS'
  | 'SEND_PAYMENT'
  | 'CALM_DOWN'
  | 'FOCUS_MODE';

interface BrainWave {
  alpha: number; // Relaxation (8-13 Hz)
  beta: number;  // Active thinking (14-30 Hz)
  theta: number; // Drowsiness (4-7 Hz)
  delta: number; // Deep sleep (0.5-3 Hz)
}

export function simulateBrainWave(): BrainWave {
  return {
    alpha: Math.random() * 100,
    beta: Math.random() * 100,
    theta: Math.random() * 50,
    delta: Math.random() * 30,
  };
}

export function interpretThought(wave: BrainWave): ThoughtCommand {
  const { alpha, beta, theta, delta } = wave;
  
  // High beta = active thinking → create campaign
  if (beta > 70 && alpha < 30) return 'CREATE_CAMPAIGN';
  
  // High alpha = relaxed → navigate dashboard
  if (alpha > 70 && beta < 30) return 'NAVIGATE_DASHBOARD';
  
  // High theta = drowsy → calm down
  if (theta > 30) return 'CALM_DOWN';
  
  // Balanced = focus mode
  if (alpha > 40 && beta > 40) return 'FOCUS_MODE';
  
  return 'VIEW_CREATORS';
}

export function detectEmotion(wave: BrainWave): string {
  const { alpha, beta } = wave;
  
  if (beta > 80) return '😤 Stressed';
  if (alpha > 80) return '😌 Relaxed';
  if (beta > 60 && alpha > 40) return '🤔 Focused';
  return '😐 Neutral';
}

export function getFocusScore(wave: BrainWave): number {
  const { alpha, beta } = wave;
  // Optimal focus: balanced alpha and beta
  return Math.min(alpha, beta);
}
