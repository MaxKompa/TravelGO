import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import CheckBoxIcon from "../assets/icons/CheckBoxIcon.svg";
import { useTripState } from "../store/useTripState";
import { Colors } from "../theme";
import { addButtonProp } from "../types";

const AnimatedPressable = createAnimatedComponent(Pressable);

export default function AddButton({ cardId }: addButtonProp) {
  const [isPressed, setIsPressed] = useState(false);
  const addSelectedLocation = useTripState((state) => state.addLocation);
  const removeSelectedLocation = useTripState((state) => state.removeLocation);
  const places = useTripState((state) => state.places);
  const selectedLocations = useTripState((state) => state.selectedLocations);

  //animation ______________________________________________________________________
  //смена плюса на галку
  const buttonText = isPressed ? (
    <CheckBoxIcon color={Colors.text2} height={"80%"} width={"80%"} />
  ) : (
    "+"
  );
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  //animation ______________________________________________________________________

  // отдельная проверка остается ли элемент внутри массива выбранных
  useEffect(() => {
    const isExists = selectedLocations.some((item) => item.id === cardId);
    if (!isExists) setIsPressed(false);
  }, [selectedLocations]);

  const togglePress = () => {
    const nextState = !isPressed;
    const currentLocation = places.find((item) => item.id === cardId);
    if (currentLocation) {
      if (nextState) {
        addSelectedLocation(currentLocation);
      } else {
        removeSelectedLocation(cardId);
      }
    }

    scale.value = withSequence(
      withTiming(0.8, { duration: 200 }),
      withTiming(1, { duration: 200 }),
    );

    setIsPressed(nextState);
    console.log(`Add button pressed, id: ${cardId}`);
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
