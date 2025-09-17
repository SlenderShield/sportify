import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  themeTransition: Animated.Value;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@sportify_theme_mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [themeTransition] = useState(() => new Animated.Value(0));

  // Determine if dark mode should be active
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  // Load theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Animate theme transition
  useEffect(() => {
    Animated.timing(themeTransition, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDark, themeTransition]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
      // Still update the state even if storage fails
      setThemeModeState(mode);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const value: ThemeContextType = {
    isDark,
    themeMode,
    setThemeMode,
    toggleTheme,
    themeTransition,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}