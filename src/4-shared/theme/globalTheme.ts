import { fonts } from "./globalFonts";

export const darkTheme = {
  background: "#1d1d1d",
  text: "#fff",
  primary: "#2c106a",
  accent: "#f4d35e",
  border: "#444",
  warning: "#29bde6ff",
  success: "#49c37cff",
  error: "#d10101ff",
  icon: "#9BA1A6",
  favoriteIcon: "#ff4081",
  shareIcon: "#29bde6ff",
  commentIcon: "#9BA1A6",
  link: "#1371d6",

  // inputs
  inputBackgroundColor: "#dedede",
  inputTextColor: "#1d1d1d",
  inputBorderColor: "#ccc",
  inputPlaceholderColor: "#687076",
  inputBorderRadius: 4,
  inputPadding: 10,

  // Buttons
  buttonBorderColor: "#687076",
  buttonBackgroundColor: "rgba(44, 16, 106, 0.9)",
  buttonTextColor: "#1d1d1d",
  buttonBorderWidth: 1,
  buttonFontSize: 14,
  buttonBorderRadius: 4,

  // secondary button
  buttonTextColorSecondary: "#1d1d1d",

  // Typography
  fontFamily: fonts.regular,
  fontFamilyBold: fonts.bold,
};

export const lightTheme = {
  background: "#fff",
  text: "#1d1d1d",
  primary: "#2c106a",
  accent: "#f4d35e",
  border: "#e0e0e0",
  warning: "#29bde6ff",
  success: "#49c37cff",
  error: "#d10101ff",
  icon: "#687076", // add icon color if not present
  favoriteIcon: "#ff4081",
  shareIcon: "#29bde6ff",
  commentIcon: "#9BA1A6",
  link: "#1371d6",

  // inputs
  inputBackgroundColor: "#dedede",
  inputTextColor: "#1d1d1d",
  inputBorderColor: "#ccc",
  inputPlaceholderColor: "#687076",
  inputBorderRadius: 4,
  inputPadding: 10,

  // Buttons
  // primary button
  buttonBorderColor: "#687076",
  buttonBackgroundColor: "rgba(44, 16, 106, 0.9)",
  buttonTextColor: "#1d1d1d",
  buttonBorderWidth: 1,
  buttonBorderRadius: 4,
  buttonFontSize: 14,

  // secondary button
  buttonTextColorSecondary: "#1d1d1d",

  // Typography
  fontFamily: fonts.regular,
  fontFamilyBold: fonts.bold,
};

export const theme = darkTheme;

export const globalTheme = {
  light: lightTheme,
  dark: darkTheme,
};
