export const Colors = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  primarySurface: '#E8F5E9',

  // Message bubbles
  sentBubble: '#2E7D32',
  sentBubbleText: '#FFFFFF',
  receivedBubble: '#F5F5F5',
  receivedBubbleText: '#212121',

  // Status
  online: '#4CAF50',
  offline: '#9E9E9E',
  error: '#D32F2F',
  warning: '#F57C00',

  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F5F5',
  inputBackground: '#F1F3F4',

  // Text
  textPrimary: '#212121',
  textSecondary: '#757575',
  textHint: '#9E9E9E',

  // Borders
  border: '#E0E0E0',

  // Dark mode
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    sentBubble: '#2E7D32',
    receivedBubble: '#2C2C2C',
    receivedBubbleText: '#E0E0E0',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    inputBackground: '#2C2C2C',
    border: '#3A3A3A',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
