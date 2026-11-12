import BycycleIcon from "@/src/assets/icons/BycicleIcon.svg";
import CarIcon from "@/src/assets/icons/CarIcon.svg";
import WalkingIcon from "@/src/assets/icons/WalkingIcon.svg";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import {
    createAnimatedComponent,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Colors } from "../theme";
import { NavButtonProps } from "../types";

const AnimatedPressable = createAnimatedComponent(Pressable);
export default function NavButton({
  setTripMethod,
  tripMethod,
  buttonType,
  height,
  width,
}: NavButtonProps) {
  const animProgress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animProgress.value,
      [0, 1],
      [Colors.secondary, Colors.primary],
    ),
  }));

  useEffect(() => {
    if (buttonType == tripMethod) {
      animProgress.value = withTiming(1, { duration: 200 });
    } else {
      animProgress.value = withTiming(0, { duration: 200 });
    }
  }, [tripMethod]);

  const isActive = buttonType === tripMethod;
  const iconColor = isActive ? "white" : "black";

  const renderIcon = () => {
    switch (buttonType) {
      case "walking":
        return <WalkingIcon color={iconColor} height={height} width={width} />;
      case "driving":
        return <CarIcon color={iconColor} height={height} width={width} />;
      case "cycling":
        return <BycycleIcon color={iconColor} height={height} width={width} />;
    }
  };

  return (
    <AnimatedPressable
      style={[styles.navButton, animatedStyle]}
      onPress={() => setTripMethod(buttonType)}
    >
      {renderIcon()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  navButton: {
    height: 50,
    width: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
