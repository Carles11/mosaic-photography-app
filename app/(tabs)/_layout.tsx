import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

export default function TabLayout() {
  const { theme } = useTheme();

  const iconColor = theme.text;
  const labelStyle = {
    color: theme.text,
    fontFamily: "TradeGothic-Bold",
    fontSize: 12,
  };

  return (
    <NativeTabs
      backgroundColor={theme.background}
      tintColor={theme.primary}
      iconColor={iconColor}
      labelStyle={labelStyle}
      // Android only: to always show labels
      labelVisibilityMode={Platform.OS === "android" ? "labeled" : undefined}
      // iOS only props
      blurEffect={Platform.OS === "ios" ? "systemMaterial" : undefined}
      disableTransparentOnScrollEdge={Platform.OS === "ios" ? true : undefined}
      minimizeBehavior={Platform.OS === "ios" ? "onScrollDown" : undefined}
      badgeBackgroundColor={theme.text}
      badgeTextColor={theme.background}
      shadowColor={Platform.OS === "ios" ? theme.border : undefined}
    >
      <NativeTabs.Trigger name="index">
        {Platform.select({
          ios: <Icon sf={{ default: "house", selected: "house.fill" }} />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />
          ),
        })}
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="favorites">
        {Platform.select({
          ios: <Icon sf={{ default: "favorite", selected: "house.fill" }} />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="favorite" />} />
          ),
        })}
        <Label>Favorites</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="collections">
        {Platform.select({
          ios: <Icon sf={{ default: "collections", selected: "house.fill" }} />,
          android: (
            <Icon
              src={<VectorIcon family={MaterialIcons} name="collections" />}
            />
          ),
        })}
        <Label>Collections</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        {Platform.select({
          ios: (
            <Icon sf={{ default: "account-circle", selected: "house.fill" }} />
          ),
          android: (
            <Icon
              src={<VectorIcon family={MaterialIcons} name="account-circle" />}
            />
          ),
        })}
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
