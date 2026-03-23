// Color Palette
export const Colors = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  primaryExtraLight: '#E8F5E9',

  secondary: '#81C784',
  accent: '#A5D6A7',

  white: '#FFFFFF',
  black: '#000000',
  background: '#F5F5F5',
  backgroundDark: '#121212',

  text: '#212121',
  textSecondary: '#757575',
  textLight: '#BDBDBD',
  textOnPrimary: '#FFFFFF',

  border: '#E0E0E0',
  borderFocused: '#2E7D32',

  error: '#D32F2F',
  errorLight: '#FFEBEE',
  success: '#388E3C',
  warning: '#F57C00',

  inputBackground: '#FAFAFA',
  placeholder: '#9E9E9E',

  // Dark mode
  darkBackground: '#121212',
  darkSurface: '#1E1E1E',
  darkCard: '#2C2C2C',
  darkText: '#E0E0E0',
  darkBorder: '#424242',
};

// Typography
export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  giant: 64,
};

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50,
  circle: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Input Heights
export const InputHeight = {
  sm: 40,
  md: 48,
  lg: 56,
};

// Button Heights
export const ButtonHeight = {
  sm: 36,
  md: 48,
  lg: 56,
};
