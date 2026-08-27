import { Pressable, StyleSheet, Text, View } from "react-native";
import {
    createAnimatedComponent,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
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
  const color = useSharedValue("#C5CEDF");
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: color.value,
  }));

  const handlePressIn = () => {
    color.value = withSpring("#858b96");
  };

  const handlePressOut = () => {
    color.value = withSpring("#C5CEDF");
  };

  //боттом меню (gorchom)

  return (
    <View style={styles.elementShadow}>
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
    </View>
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
    flex: 1,
  },

  elementShadow: {
    height: 75,
    width: "100%",
    borderRadius: 17,
    marginVertical: 10,
    elevation: 2,
  },

  elementTitle: {
    fontSize: 17,
  },
});
