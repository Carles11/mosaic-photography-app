import { fonts } from "./globalFonts";

export const lightTheme = {
  background: "#fff",
  text: "#1d1d1d",
  primary: "#cccaca",
  accent: "#f4d35e",
  border: "#e0e0e0",
  warning: "#29bde6ff",
  success: "#3de382ff",
  error: "#d10101ff",
  icon: "#687076", // add icon color if not present
  favoriteIcon: "#ff4081",

  // Buttons
  buttonBorderColor: "#687076",
  buttonBackgroundColor: "#ededed",
  buttonTextColor: "#1d1d1d",
  buttonBorderWidth: 1,
  buttonBorderRadius: 4,
  buttonFontSize: 14,
  // Typography
  fontFamily: fonts.regular,
  fontFamilyBold: fonts.bold,
};

export const darkTheme = {
  background: "#1d1d1d",
  text: "#fff",
  primary: "#2c106a",
  accent: "#f4d35e",
  border: "#444",
  warning: "#29bde6ff",
  success: "#3de382ff",
  error: "#d10101ff",
  icon: "#9BA1A6", // add icon color if not present
  favoriteIcon: "#ff4081",

  // Buttons
  buttonBorderColor: "#687076",
  buttonBackgroundColor: "#ededed",
  buttonTextColor: "#fff",
  buttonBorderWidth: 1,
  buttonFontSize: 14,
  buttonBorderRadius: 4,

  // Typography
  fontFamily: fonts.regular,
  fontFamilyBold: fonts.bold,
};

export const theme = darkTheme;

export const globalTheme = {
  light: lightTheme,
  dark: darkTheme,
};
