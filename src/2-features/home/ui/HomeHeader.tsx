import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useColorScheme } from "@/4-shared/hooks/use-color-scheme";
import { globalTheme } from "@/4-shared/theme/globalTheme";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./HomeHeader.styles";

export type HomeSectionTab = "photographers" | "selection" | "gallery";

type HomeHeaderProps = {
  onOpenFilters?: () => void;
  activeTab: HomeSectionTab;
  onTabPress: (tab: HomeSectionTab) => void;
  showTabIcons?: boolean;
};

const TABS: {
  key: HomeSectionTab;
  label: string;
  icon: string;
  type: "material" | "ion";
}[] = [
  { key: "photographers", label: "Photographers", icon: "camera", type: "ion" },
  {
    key: "selection",
    label: "Selection",
    icon: "auto-awesome",
    type: "material",
  },
  {
    key: "gallery",
    label: "Gallery",
    icon: "photo-library",
    type: "material",
  },
];

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onOpenFilters,
  activeTab,
  onTabPress,
  showTabIcons = true,
}) => {
  const colorScheme = useColorScheme();
  const theme = globalTheme[colorScheme];

  return (
    <ThemedView style={styles.header}>
      <TouchableOpacity
        activeOpacity={0.84}
        style={[
          styles.searchBar,
          {
            backgroundColor: colorScheme === "dark" ? "#f7f7f7" : "#fff",
            borderColor: theme.border,
          },
        ]}
        onPress={onOpenFilters}
        accessibilityRole="button"
        accessibilityLabel="Search images"
      >
        <IconSymbol
          type="material"
          name="search"
          size={20}
          color="#1d1d1d"
          accessibilityLabel="Search"
        />
        <ThemedText type="defaultSemiBold" style={styles.searchText}>
          Search images
        </ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.72}
              style={[
                styles.tabButton,
                !showTabIcons && styles.tabButtonCompact,
              ]}
              onPress={() => onTabPress(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <View
                style={[
                  styles.tabIconWrap,
                  !showTabIcons && styles.tabIconHidden,
                ]}
              >
                <IconSymbol
                  type={tab.type}
                  name={tab.icon}
                  size={25}
                  color={isActive ? theme.text : theme.icon}
                />
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.tabLabel,
                  { color: isActive ? theme.text : theme.icon },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </ThemedText>
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: isActive ? theme.text : "transparent" },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
};
