import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TabIconProps } from "../types";

export default function AnimatedTabIcon({
  IconComponent,
  activeColor,
  inactiveColor,
  iconHeight,
  iconWidth,
}: TabIconProps) {
  const isFocused = useIsFocused();

  const progress = useSharedValue(0);

  // useAnimatedReaction(
  //   () => progress.value,
  //   (value) => {
  //     console.log(value);
  //   },
  // );

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, {
      duration: 100,
      easing: Easing.linear,
    });
  }, [isFocused]);

  const animatedProps = useAnimatedProps(() => {
    const currentColor = interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor],
    );
    return {
      color: currentColor,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.2]);
    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, { marginTop: 3 }]}>
      <IconComponent
        width={iconWidth}
        height={iconHeight}
        animatedProps={animatedProps}
      />
    </Animated.View>
  );
}
