import AsyncStorage from "@react-native-async-storage/async-storage";
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

const STORAGE_MODE_KEY = "mosaic.theme.mode";
const STORAGE_OVERRIDDEN_KEY = "mosaic.theme.overridden";

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
  // Always default to dark, regardless of system
  const getInitialSystemMode = (): "light" | "dark" => "dark";
  const [systemMode, setSystemMode] = useState<"light" | "dark">(
    getInitialSystemMode()
  );
  const [mode, setModeState] = useState<"light" | "dark">("dark");
  const [isUserOverridden, setIsUserOverridden] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate theme state from AsyncStorage on mount
  useEffect(() => {
    const hydrateTheme = async () => {
      try {
        const [storedMode, storedOverride] = await Promise.all([
          AsyncStorage.getItem(STORAGE_MODE_KEY),
          AsyncStorage.getItem(STORAGE_OVERRIDDEN_KEY),
        ]);
        if (
          storedOverride === "true" &&
          (storedMode === "light" || storedMode === "dark")
        ) {
          setModeState(storedMode);
          setIsUserOverridden(true);
        } else {
          // Not user overridden: always force dark by default, regardless of device setting
          setModeState("dark");
          setSystemMode("dark");
          setIsUserOverridden(false);
        }
      } catch (e) {
        // Fallback: always use dark
        setModeState("dark");
        setSystemMode("dark");
        setIsUserOverridden(false);
      } finally {
        setIsHydrated(true);
      }
    };
    hydrateTheme();
  }, []);

  // Listen to system mode changes, but only apply if not user-overridden (in case you want to switch to system in the future)
  useEffect(() => {
    const onChange = ({
      colorScheme,
    }: {
      colorScheme: "light" | "dark" | undefined | null;
    }) => {
      const newMode = "dark"; // always force dark, regardless of system
      setSystemMode(newMode);
      if (!isUserOverridden) {
        setModeState(newMode);
      }
    };
    const subscription = Appearance.addChangeListener(onChange);
    return () => subscription.remove();
  }, [isUserOverridden]);

  // Persist theme override to AsyncStorage
  const persistThemeOverride = async (
    customMode: "light" | "dark",
    overridden: boolean
  ) => {
    if (overridden) {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_MODE_KEY, customMode),
        AsyncStorage.setItem(STORAGE_OVERRIDDEN_KEY, "true"),
      ]);
    } else {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_MODE_KEY),
        AsyncStorage.removeItem(STORAGE_OVERRIDDEN_KEY),
      ]);
    }
  };

  // User can override mode
  const setMode = (customMode: "light" | "dark") => {
    setModeState(customMode);
    setIsUserOverridden(true);
    persistThemeOverride(customMode, true);
  };

  // User can reset to system (which is always dark in this config)
  const resetToSystem = () => {
    setModeState("dark");
    setIsUserOverridden(false);
    persistThemeOverride("dark", false);
  };

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  if (!isHydrated) {
    // Optionally render a splash screen here
    return null;
  }

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
