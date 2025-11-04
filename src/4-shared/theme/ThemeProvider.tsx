import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "./globalTheme";

type ThemeType = typeof lightTheme;
type ThemeContextType = {
  theme: ThemeType;
  mode: "light" | "dark";
  systemMode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void; // User override
  resetToSystem: () => void; // Revert to system
  isUserOverridden: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  mode: "dark",
  systemMode: "dark",
  setMode: () => {},
  resetToSystem: () => {},
  isUserOverridden: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [systemMode, setSystemMode] = useState<"light" | "dark">(
    Appearance.getColorScheme() === "dark" ? "dark" : "light"
  );
  const [mode, setModeState] = useState<"light" | "dark">(systemMode);
  const [isUserOverridden, setIsUserOverridden] = useState(false);

  // Listen to system mode changes, but only apply if not user-overridden
  useEffect(() => {
    const onChange = ({
      colorScheme,
    }: {
      colorScheme: "light" | "dark" | undefined | null;
    }) => {
      const newMode = colorScheme === "dark" ? "dark" : "light";
      setSystemMode(newMode);
      if (!isUserOverridden) {
        setModeState(newMode);
      }
    };
    const subscription = Appearance.addChangeListener(onChange);
    return () => subscription.remove();
  }, [isUserOverridden]);

  // User can override mode
  const setMode = (customMode: "light" | "dark") => {
    setModeState(customMode);
    setIsUserOverridden(true);
  };

  // User can reset to system
  const resetToSystem = () => {
    setModeState(systemMode);
    setIsUserOverridden(false);
  };

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        systemMode,
        setMode,
        resetToSystem,
        isUserOverridden,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
