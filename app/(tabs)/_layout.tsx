import {
  animatedHomeIcon,
  animatedLocIcon,
  animatedMapIcon,
  animatedThemesIcon,
  animatedToolsIcon,
} from "@/src/assets/icons";
import AnimatedTabIcon from "@/src/components/AnimatedTabIcon";
import { TAB_SCREEN_CONFIG } from "@/src/types";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  const iconConfig = {
    width: 20,
    height: 20,
    ActiveTintColor: "#18325B",
    InactiveTintColor: "#EAEAEA",
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
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.navBackground,
        tabBarActiveTintColor: iconConfig.ActiveTintColor,
        tabBarInactiveTintColor: iconConfig.InactiveTintColor,
        animation: "shift",

        tabBarBackground: () => (
          <BlurView
            intensity={95}
            tint="default"
            style={StyleSheet.absoluteFill}
          >
            {/* разобраться с координатами */}
            <LinearGradient
              colors={["#0d214b62", "#1f52a570", "#7394d16b"]} //"#0d214bb2", "#1f52a5b6", "#7394d1b0"
              start={{ x: 1.3, y: 1.1 }}
              end={{ x: 0, y: -0.1 }}
              locations={[0, 0.5, 0.9]}
              style={[{ borderRadius: 20 }, StyleSheet.absoluteFill]}
            />
          </BlurView>
        ),
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
    bottom: 10,
    alignSelf: "center",
    height: 60,
    borderRadius: 20,
    margin: 10,
    overflow: "hidden",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderWidth: 0,
    elevation: 0,
  },
});
