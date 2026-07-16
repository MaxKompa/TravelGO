import { BlurView } from "expo-blur";
import { Tabs, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import HomeIcon from "../../src/assets/icons/HomeIcon.svg";
import LocIcon from "../../src/assets/icons/LocIcon.svg";
import MapIcon from "../../src/assets/icons/MapIcon.svg";
import ThemesIcon from "../../src/assets/icons/ThemesIcon.svg";
import ToolsIcon from "../../src/assets/icons/ToolsIcon.svg";

export default function RootLayout() {
  const pathName = usePathname();
  console.log(pathName);

  // эффект на случай если нужно проверить на какой вкладке находиться пользователь
  // useEffect(() => {
  //   alert(pathName);
  // }, [pathName]);
  const iconConfig = {
    width: 20,
    height: 20,
    ActiveTintColor: "#18325B",
    InactiveTintColor: "#EAEAEA",
  };

  const isHomeGroupScreens =
    pathName.includes("home") ||
    pathName.includes("locations") ||
    pathName.includes("themes");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.navBackground,
        tabBarActiveTintColor: iconConfig.ActiveTintColor,
        tabBarInactiveTintColor: iconConfig.InactiveTintColor,
        tabBarBackground: () => (
          <BlurView
            intensity={40}
            tint="light"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          >
            <View
              style={[
                {
                  backgroundColor: "#0a5ee62c",
                  borderRadius: 20,
                },
                StyleSheet.absoluteFill,
              ]}
            ></View>
          </BlurView>
        ),
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => {
            const iconColor = focused
              ? iconConfig.ActiveTintColor
              : iconConfig.InactiveTintColor;
            return (
              <MapIcon
                height={iconConfig.height}
                width={iconConfig.width}
                color={iconColor}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="themes"
        options={{
          title: "Themes",
          tabBarButton: isHomeGroupScreens ? undefined : () => null,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused
              ? iconConfig.ActiveTintColor
              : iconConfig.InactiveTintColor;
            return (
              <ThemesIcon
                height={iconConfig.height}
                width={iconConfig.width}
                color={iconColor}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => {
            const iconColor = focused
              ? iconConfig.ActiveTintColor
              : iconConfig.InactiveTintColor;
            return (
              <HomeIcon
                height={iconConfig.height}
                width={iconConfig.width}
                color={iconColor}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          tabBarButton: isHomeGroupScreens ? undefined : () => null,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused
              ? iconConfig.ActiveTintColor
              : iconConfig.InactiveTintColor;
            return (
              <LocIcon
                height={iconConfig.height}
                width={iconConfig.width}
                color={iconColor}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ focused }) => {
            const iconColor = focused
              ? iconConfig.ActiveTintColor
              : iconConfig.InactiveTintColor;
            return (
              <ToolsIcon
                height={iconConfig.height}
                width={iconConfig.width}
                color={iconColor}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navBackground: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    height: 60,
    borderRadius: 20,
    margin: 10,
    overflow: "hidden",
  },
});
