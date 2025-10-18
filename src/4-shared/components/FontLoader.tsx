import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export default function FontLoader({ children }: { children: React.ReactNode }) {
  const [fontsLoaded] = useFonts({
    "TradeGothic-Regular": require("../assets/fonts/TradeGothic-Regular.ttf"),
    "TradeGothic-Bold": require("../assets/fonts/TradeGothic-Bold.ttf"),
    // Add Light/ExtraBold if you want support for those
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return <>{children}</>;
}