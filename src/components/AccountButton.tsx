import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import NoLogginedUserIcon from "../../src/assets/icons/noLogginedUserIcon.svg";

export default function AccountButton() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navigateToAccount = () => {
    router.replace("/userAccount");
  };

  //animation
  const scale = useSharedValue(1);
  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.8, { duration: 200 }),
      withTiming(1, { duration: 200 }, (isFinished) => {
        if (isFinished) {
          scheduleOnRN(navigateToAccount);
        }
      }),
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isCustomAvatarExists = false; // нужно сделать подключение своей аватарки

  const avatarIcon = isCustomAvatarExists ? (
    <Text style={{ color: "white" }}>Custom avatar img!!</Text>
  ) : (
    <NoLogginedUserIcon color={"white"} />
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
    backgroundColor: "#000000af",
    padding: 7,
    borderRadius: 15,
  },
});
