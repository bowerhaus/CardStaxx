// Typography constants for consistent font usage across the application
export const FONT_FAMILY = 'Nunito, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// Font size constants
export const FONT_SIZES = {
  xs: '10px',
  sm: '12px',
  md: '14px',
  lg: '16px',
  xl: '18px',
} as const;

// Font weight constants
export const FONT_WEIGHTS = {
  normal: 'normal',
  medium: '500',
  semibold: '600',
  bold: 'bold',
} as const;

// Card dimension constants
export const CARD_WIDTH = 200;
export const CARD_HEIGHT = 173; // 150 * 1.15 = 172.5, rounded to 173