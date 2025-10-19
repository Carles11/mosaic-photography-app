import { HomeHeader } from "@/2-features/home-header"; // Import via public API
import { MainGallery } from "@/2-features/main-gallery"; // Import via public API
import { BottomSheetFilterMenu } from "@/2-features/main-gallery/ui/BottomSheetFilterMenu ";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Home.styles";

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  return (
    <SafeAreaView
      style={[{ flex: 1 }, styles.page, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <HomeHeader onOpenFilters={() => setFilterMenuOpen(true)} />
      <BottomSheetFilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
      />
      <MainGallery />
    </SafeAreaView>
  );
};
