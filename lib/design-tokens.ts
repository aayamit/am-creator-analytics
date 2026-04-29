/**
 * Bloomberg × McKinsey Design Tokens
 * Minimalist management-consultant aesthetics
 */

export const designTokens = {
  colors: {
    // Primary palette (from memory)
    bg: '#F8F7F4',           // Warm off-white background
    text: '#1a1a2e',          // Deep navy text
    accent: '#92400e',         // Brownish-gold accent

    // Extended palette
    surface: '#FFFFFF',
    border: '#e5e7eb',
    muted: '#f1f5f9',
    success: '#16a34a',
    warning: '#ca8a04',
    error: '#dc2626',

    // Chart colors
    chart1: '#1a1a2e',
    chart2: '#92400e',
    chart3: '#2563eb',
    chart4: '#7c3aed',
    chart5: '#db2777',
  },

  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, Fira Code, monospace',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};

export const chartConfig = {
  series: [
    { name: 'Revenue', color: '#1a1a2e' },
    { name: 'Margin', color: '#92400e' },
    { name: 'Creators', color: '#2563eb' },
    { name: 'Campaigns', color: '#7c3aed' },
  ],
  grid: {
    stroke: '#e5e7eb',
    strokeDasharray: '3 3',
  },
  tooltip: {
    bg: '#1a1a2e',
    color: '#F8F7F4',
  },
};
