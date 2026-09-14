import Background from "@/src/components/Background";
import Header from "@/src/components/Header";
import { Colors } from "@/src/theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import NoLogginedUserIcon from "../../src/assets/icons/noLogginedUserIcon.svg";

const AnimatedPressable = createAnimatedComponent(Pressable);

export default function userAccount() {
  const username = "ExampleUser123";
  const [trips, setTrips] = useState([]);
  const [review, setReview] = useState([]);
  const [optionSelected, setOptionSelected] = useState<"trips" | "reviews">(
    "trips",
  );

  const animProgres = useSharedValue(0);

  const backgroundStyleRev = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animProgres.value,
      [0, 1],
      ["#fff", "#2e71df"],
    ),
  }));
  const textStyleRev = useAnimatedStyle(() => ({
    color: interpolateColor(animProgres.value, [0, 1], ["#000000", "#ffffff"]),
  }));

  const backgroundStyleTr = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animProgres.value,
      [0, 1],
      ["#2e71df", "#fff"],
    ),
  }));
  const textStyleTr = useAnimatedStyle(() => ({
    color: interpolateColor(animProgres.value, [0, 1], ["#fff", "#000000"]),
  }));
  const handlePress = (option: "trips" | "reviews") => {
    setOptionSelected(option);

    animProgres.value = withTiming(option == "trips" ? 0 : 1, {
      duration: 300,
    });
  };
  return (
    <Background>
      <Header text="Profile" />
      <View style={styles.contentWrapper}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBackground}>
            <NoLogginedUserIcon
              width={80}
              height={80}
              color={"white"}
            ></NoLogginedUserIcon>
          </View>
          <View style={styles.usernameConteiner}>
            <Text style={styles.usernameText}>{username}</Text>
          </View>
        </View>
        <View style={styles.selector}>
          <AnimatedPressable
            style={[styles.selectorOption, backgroundStyleTr]}
            onPress={() => handlePress("trips")}
          >
            <Animated.Text style={[styles.optionText, textStyleTr]}>
              Trips
            </Animated.Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={[styles.selectorOption, backgroundStyleRev]}
            onPress={() => handlePress("reviews")}
          >
            <Animated.Text style={[styles.optionText, textStyleRev]}>
              Reviews
            </Animated.Text>
          </AnimatedPressable>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.background,
  },
  avatarWrapper: {
    height: 350,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBackground: {
    backgroundColor: "#000000af",
    borderRadius: 100,
    padding: 20,
    marginTop: 70,
  },
  usernameConteiner: {
    alignSelf: "center",
    borderBottomWidth: 2,
    borderColor: Colors.secondary,
  },
  usernameText: {
    fontFamily: "Text",
    fontSize: 30,
    color: Colors.text,
    paddingVertical: 10,
  },
  selector: {
    width: "100%",
    height: 40,
    flexDirection: "row",
  },
  selectorOption: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: "white",
    borderTopWidth: 1,

    borderColor: Colors.background,
  },
  optionText: {
    textAlign: "center",
    fontFamily: "Text",
    fontSize: 20,
  },
});
