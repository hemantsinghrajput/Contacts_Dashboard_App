// theme/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../utils/theme';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  colors: typeof lightTheme;
  toggleTheme: () => void;
}>({
  theme: 'light',
  colors: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      } else {
        const systemTheme: ColorSchemeName = Appearance.getColorScheme();
        setTheme(systemTheme === 'dark' ? 'dark' : 'light');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    await AsyncStorage.setItem('theme', next);
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
