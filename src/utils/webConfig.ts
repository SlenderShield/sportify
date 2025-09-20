// Web-specific configuration
export const webConfig = {
  // Responsive breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  },

  // Web-specific styles
  styles: {
    maxWidth: '1200px',
    containerPadding: '20px',
    borderRadius: '12px',
    shadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },

  // Web-specific features
  features: {
    enableKeyboardNavigation: true,
    enableRightClickMenu: false,
    enableDragAndDrop: true,
  },
};

// Platform detection utilities
export const isWeb = typeof window !== 'undefined';
export const isMobile = isWeb ? window.innerWidth < 768 : false;
export const isTablet = isWeb
  ? window.innerWidth >= 768 && window.innerWidth < 1024
  : false;
export const isDesktop = isWeb ? window.innerWidth >= 1024 : false;
