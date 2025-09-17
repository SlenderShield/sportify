import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Screen dimension breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Get current screen size category
export const getScreenSize = () => {
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

// Responsive font size
export const responsiveFont = (size: number) => {
  const scale = width / 375; // Based on iPhone X as baseline
  const newSize = size * scale;
  return Math.max(newSize, size * 0.85); // Minimum scale factor
};

// Responsive spacing
export const responsiveSpacing = (space: number) => {
  const scale = width / 375;
  return Math.round(space * scale);
};

// Check if device is tablet
export const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  }
  
  return (
    (width >= 768 && height >= 1024) || 
    (width >= 1024 && height >= 768)
  );
};

// Get adaptive layout properties
export const getAdaptiveLayout = () => {
  const screenSize = getScreenSize();
  const tablet = isTablet();
  
  return {
    screenSize,
    isTablet: tablet,
    isPhone: !tablet,
    columns: tablet ? 2 : 1,
    padding: tablet ? 32 : 24,
    maxWidth: tablet ? 600 : '100%',
    // Quick action button sizing
    quickActionColumns: tablet ? 6 : 4,
    quickActionMaxWidth: tablet ? '15%' : '22%',
  };
};

// Responsive width percentage
export const widthPercentageToDP = (widthPercent: number) => {
  return (widthPercent * width) / 100;
};

// Responsive height percentage
export const heightPercentageToDP = (heightPercent: number) => {
  return (heightPercent * height) / 100;
};

export { width as screenWidth, height as screenHeight };