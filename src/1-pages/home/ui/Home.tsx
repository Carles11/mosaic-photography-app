import { HomeHeader } from "@/2-features/home-header"; // Import via public API
import { MainGallery } from "@/2-features/main-gallery"; // Import via public API
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Home.styles";

export const Home: React.FC = () => {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      style={[styles.page, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <HomeHeader />
      <MainGallery />
    </SafeAreaView>
  );
};
