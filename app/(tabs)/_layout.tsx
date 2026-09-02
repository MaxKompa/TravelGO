import {
  animatedHomeIcon,
  animatedLocIcon,
  animatedMapIcon,
  animatedThemesIcon,
  animatedToolsIcon,
} from "@/src/assets/icons";
import AnimatedTabIcon from "@/src/components/AnimatedTabIcon";
import { Colors } from "@/src/theme";
import { TAB_SCREEN_CONFIG } from "@/src/types";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const iconConfig = {
    width: 20,
    height: 20,
    ActiveTintColor: "#0d58d1",
    InactiveTintColor: "#747474",
  };

  const TAB_SCREENS: TAB_SCREEN_CONFIG[] = [
    { name: "map", title: "Map", icon: animatedMapIcon },
    { name: "themes", title: "Themes", icon: animatedThemesIcon },
    { name: "home", title: "Home", icon: animatedHomeIcon },
    { name: "locations", title: "Locations", icon: animatedLocIcon },
    { name: "tools", title: "Tools", icon: animatedToolsIcon },
  ];

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.navBackground,
        tabBarActiveTintColor: iconConfig.ActiveTintColor,
        tabBarInactiveTintColor: iconConfig.InactiveTintColor,
        animation: "shift",
        lazy: false,
        sceneStyle: { backgroundColor: Colors.background },
        freezeOnBlur: true,

        tabBarBackground: () => <View style={styles.navBackground}></View>,
      }}
    >
      {TAB_SCREENS.map((screen: TAB_SCREEN_CONFIG) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: () => {
              return (
                <AnimatedTabIcon
                  activeColor={iconConfig.ActiveTintColor}
                  inactiveColor={iconConfig.InactiveTintColor}
                  iconWidth={iconConfig.width}
                  iconHeight={iconConfig.height}
                  IconComponent={screen.icon}
                />
              );
            },
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navBackground: {
    position: "absolute",
    alignSelf: "center",
    height: 75,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
    borderTopWidth: 0,
    borderWidth: 0,
    elevation: 0,
  },
});
