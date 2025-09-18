/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#FF9500',
        background: '#FFFFFF',
        surface: '#F2F2F7',
        text: '#111111',
        muted: '#6B7280',
        accent: '#34D399',
        danger: '#EF4444',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
      },
      fontSize: {
        body: ['16px', { lineHeight: '24px' }],
        heading: ['24px', { lineHeight: '32px' }],
        caption: ['12px', { lineHeight: '16px' }],
      },
    },
  },
  plugins: [],
  safelist: [
    'dark:bg-background',
    'dark:text-text',
    'dark:bg-surface',
    'dark:text-primary',
    'dark:text-secondary',
    'dark:text-accent',
    'dark:text-danger',
    'dark:text-muted',
  ],
};
