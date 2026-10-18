import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import {
    createAnimatedComponent,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import CheckBoxIcon from "../assets/icons/CheckBoxIcon.svg";
import { Colors } from "../theme";

const AnimatedPressable = createAnimatedComponent(Pressable);
export default function AddButton() {
  const [isPressed, setIsPressed] = useState(false);
  const buttonText = isPressed ? (
    <CheckBoxIcon color={Colors.text2} height={"80%"} width={"80%"} />
  ) : (
    "+"
  );
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const togglePress = () => {
    const nextState = !isPressed;
    scale.value = withSequence(
      withTiming(0.8, { duration: 200 }),
      withTiming(1, { duration: 200 }),
    );

    setIsPressed(nextState);
    console.log("Add button pressed");
  };

  return (
    <AnimatedPressable
      style={[styles.addButton, animatedStyle]}
      onPress={() => togglePress()}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 35,
          fontFamily: "Text",
          color: Colors.text2,
        }}
      >
        {buttonText}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: "100%",
    height: "70%",
    backgroundColor: Colors.button1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
