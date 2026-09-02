import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  createAnimatedComponent,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import UpArrow from "../assets/icons/upArrow.svg";
import { Colors } from "../theme";
import { ToolsListOptionProps } from "../types";

const AnimatedOption = createAnimatedComponent(Pressable);

export default function ToolsListOption({
  title,
  handleOpenPress,
}: ToolsListOptionProps) {
  //
  //анимация
  const isPressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      isPressed.value,
      [0, 1],
      [Colors.background, "#bdc2ca"],
    ),
  }));

  const handlePressIn = () => {
    isPressed.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    isPressed.value = withTiming(0, { duration: 150 });
  };

  //боттом меню (gorchom)

  return (
    <AnimatedOption
      style={[styles.elementBackground, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleOpenPress}
    >
      <Text style={styles.elementTitle}>{title}</Text>
      <View
        style={{
          height: 30,
          width: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <UpArrow
          style={{
            height: 20,
            width: 20,
            zIndex: 5,
            transform: [{ rotate: "270deg" }],
          }}
        />
      </View>
    </AnimatedOption>
  );
}

const styles = StyleSheet.create({
  elementBackground: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 75,
    width: "100%",
    marginVertical: 10,
  },

  elementTitle: {
    fontSize: 17,
  },
});
