import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoutButtonIcon from "../assets/icons/LogoutButton.svg";
import { LogoutButtonProps } from "../types";

export default function LogoutButton({
  setIsConfirmModalOpen,
}: LogoutButtonProps) {
  const insets = useSafeAreaInsets();

  //animation
  const scale = useSharedValue(1);
  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.8, { duration: 200 }),
      withTiming(1, { duration: 200 }),
    );

    setIsConfirmModalOpen(true);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isCustomAvatarExists = false; // нужно сделать подключение своей аватарки

  const avatarIcon = isCustomAvatarExists ? (
    <Text style={{ color: "white" }}>Custom avatar img!!</Text>
  ) : (
    <LogoutButtonIcon color={"#e00909"} height={25} width={25} />
  );

  return (
    <Animated.View
      style={[
        styles.accountIconWrapper,
        animatedStyle,
        { top: insets.top + 5 },
      ]}
    >
      <Pressable onPress={handlePress}>{avatarIcon}</Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  accountIconWrapper: {
    position: "absolute",
    width: 45,
    height: 45,
    right: 10,
    zIndex: 3,
    backgroundColor: "#a5a5a57c",
    padding: 7,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
