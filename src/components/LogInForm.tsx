import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import ClearButtonIcon from "../assets/icons/ClearButtonIcon.svg";
import { Colors } from "../theme";

import { useEffect } from "react";
import { LogInFormProps } from "../types";

export default function LogInForm({ onClose, isLogInOpen }: LogInFormProps) {
  const opacity = useSharedValue(0);
  const blurStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 400 }),
  }));

  const transformY = useSharedValue(600);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: transformY.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 50 });
    transformY.value = withTiming(0, { duration: 400 });
  }, [isLogInOpen]);
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          position: "absolute",
        },
        blurStyle,
      ]}
    >
      <BlurView
        intensity={90}
        tint="dark"
        style={[StyleSheet.absoluteFillObject, { justifyContent: "center" }]}
      >
        <Animated.View style={[styles.logInCard, cardStyle]}>
          <KeyboardAwareScrollView
            extraHeight={40}
            enableOnAndroid={true}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.label}> Sign In </Text>
              <Pressable onPress={() => onClose()}>
                <ClearButtonIcon width={20} height={20} color={Colors.text} />
              </Pressable>
            </View>

            <View style={styles.formWrapper}>
              <Text>E-mail:</Text>
              <TextInput />
              <Text>Password:</Text>
              <TextInput />
            </View>
          </KeyboardAwareScrollView>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logInCard: {
    alignSelf: "center",
    height: 400,
    width: "75%",
    backgroundColor: "white",
    borderRadius: 15,
  },
  formWrapper: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  label: {
    fontSize: 24,
    fontFamily: "LabelFont",
    color: "black",
  },
});
