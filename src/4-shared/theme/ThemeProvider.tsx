import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { darkTheme, lightTheme } from './globalTheme';

type ThemeType = typeof lightTheme;

type ThemeContextType = {
  theme: ThemeType;
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  mode: 'dark',
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detect system theme, default to dark
  const systemColorScheme = Appearance.getColorScheme();
  const [mode, setMode] = useState<'light' | 'dark'>(systemColorScheme === 'light' ? 'light' : 'dark');

  // Update on system preference change
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setMode(colorScheme === 'light' ? 'light' : 'dark');
    });
    return () => {
      // @ts-ignore
      if (listener?.remove) listener.remove();
      // For RN >= 0.65: Appearance.removeChangeListener(listener);
    };
  }, []);

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};