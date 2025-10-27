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

  const iconColor = theme.primary;
  const labelStyle = {
    color: theme.text,
    fontFamily: "TradeGothic-Bold",
    fontSize: 12,
  };

  return (
    <NativeTabs
      backgroundColor={theme.background}
      tintColor={"white"}
      iconColor={iconColor}
      labelStyle={labelStyle}
      // Android only: to always show labels
      labelVisibilityMode={Platform.OS === "android" ? "unlabeled" : undefined}
      // iOS only props
      blurEffect={Platform.OS === "ios" ? "systemMaterial" : undefined}
      disableTransparentOnScrollEdge={Platform.OS === "ios" ? true : undefined}
      minimizeBehavior={Platform.OS === "ios" ? "onScrollDown" : undefined}
      badgeBackgroundColor={theme.text}
      badgeTextColor={theme.background}
      shadowColor={Platform.OS === "ios" ? theme.border : undefined}
      // tabBarHeight={Platform.select({
      //   ios: 70,
      //   android: 90,
      //   default: 70,
      // })}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.TabBar shadowColor="red" />
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
          ios: <Icon sf={{ default: "heart", selected: "heart.fill" }} />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="favorite" />} />
          ),
        })}
        <Label>Favorites</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="collections">
        {Platform.select({
          ios: (
            <Icon
              sf={{
                default: "square.grid.2x2",
                selected: "square.grid.2x2.fill",
              }}
            />
          ),
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
          ios: <Icon sf={{ default: "person", selected: "person.fill" }} />,
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
