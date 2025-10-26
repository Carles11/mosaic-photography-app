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
  setMode: (mode: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  mode: "dark",
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = Appearance.getColorScheme();
  const [mode, setMode] = useState<"light" | "dark">(
    systemColorScheme === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    const callback = ({
      colorScheme,
    }: {
      colorScheme: "light" | "dark" | null | undefined;
    }) => {
      if (colorScheme === "light" || colorScheme === "dark") {
        setMode(colorScheme);
      }
    };
    const subscription = Appearance.addChangeListener(callback);
    return () => subscription.remove();
  }, []);

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );
  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
