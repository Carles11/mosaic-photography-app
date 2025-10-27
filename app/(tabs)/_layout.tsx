import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { Icon, NativeTabs, VectorIcon } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

export default function TabLayout() {
  const { theme } = useTheme();

  const iconColor = theme.icon;
  const labelStyle = {
    color: theme.text,
    fontFamily: "TradeGothic-Bold",
    fontSize: 12,
  };

  // Platform-specific props to avoid passing undefined
  const nativeTabsProps = {
    backgroundColor: theme.background,
    tintColor: theme.primary,
    iconColor: iconColor,
    labelStyle: labelStyle,
    badgeBackgroundColor: theme.text,
    badgeTextColor: theme.background,
    ...(Platform.OS === "android"
      ? { labelVisibilityMode: "unlabeled" as "unlabeled" }
      : {}),
    ...(Platform.OS === "ios"
      ? {
          blurEffect: "systemMaterial" as const,
          disableTransparentOnScrollEdge: Platform.OS === "ios",
          minimizeBehavior: "onScrollDown" as "onScrollDown",
          shadowColor: theme.border,
        }
      : {}),
  };

  return (
    <NativeTabs {...nativeTabsProps}>
      <NativeTabs.Trigger name="index">
        {Platform.OS === "ios" ? (
          <Icon sf={{ default: "house", selected: "house.fill" }} />
        ) : (
          <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />
        )}
        {/* Label removed */}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="favorites">
        {Platform.OS === "ios" ? (
          <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        ) : (
          <Icon src={<VectorIcon family={MaterialIcons} name="favorite" />} />
        )}
        {/* Label removed */}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="collections">
        {Platform.OS === "ios" ? (
          <Icon
            sf={{
              default: "square.grid.2x2",
              selected: "square.grid.2x2.fill",
            }}
          />
        ) : (
          <Icon
            src={<VectorIcon family={MaterialIcons} name="collections" />}
          />
        )}
        {/* Label removed */}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        {Platform.OS === "ios" ? (
          <Icon sf={{ default: "person", selected: "person.fill" }} />
        ) : (
          <Icon
            src={<VectorIcon family={MaterialIcons} name="account-circle" />}
          />
        )}
        {/* Label removed */}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
