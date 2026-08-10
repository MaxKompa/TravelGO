import Background from "@/src/components/Background";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Header from "../../src/components/Header";
import { Colors } from "../../src/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  //button animation
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const router = useRouter();
  const [inputData, setInputData] = useState({
    country: "",
    city: "",
    start_datetime: "2026-08-03T10:00.274Z",
    end_datetime: "2026-08-03T18:00.274Z",
    theme: "",
  });

  const handlePress = () => {
    setTimeout(() => {
      router.push({
        pathname: "/themes",
        params: {
          country: inputData.country,
          city: inputData.city,
          theme: inputData.theme,
        },
      });
    }, 220);
  };

  // useEffect(() => {
  //   console.log(inputData.city, inputData.country);
  // }, [inputData]);

  return (
    <Background>
      <Header text={"TravelGo"} />

      <View style={styles.formContainer}>
        <View style={styles.formWrapper}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.formText}>Select Country:</Text>
            <TextInput
              style={styles.inputs}
              placeholder="np.Poland"
              onChangeText={(text: string) =>
                setInputData((prev) => ({
                  ...prev,
                  country: text,
                }))
              }
            ></TextInput>
            <Text style={styles.formText}>Select City:</Text>
            <TextInput
              style={styles.inputs}
              placeholder="np.Katowice"
              onChangeText={(text: string) =>
                setInputData((prev) => ({
                  ...prev,
                  city: text,
                }))
              }
            ></TextInput>
            <View style={styles.bottomWrapper}>
              <View style={styles.asideWrapper}>
                <Text style={[styles.formText, { fontSize: 25 }]}>
                  Start time:
                </Text>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.inputs, { width: 150 }]}
                  placeholder="dd.mm.rrrr"
                ></TextInput>
              </View>
              <View style={styles.separator}></View>
              <View style={styles.asideWrapper}>
                <Text style={[styles.formText, { fontSize: 25 }]}>
                  End time:
                </Text>

                {/* добавить библиотеку которая добавляет выбор даты */}
                <TextInput
                  keyboardType="numeric"
                  style={[styles.inputs, { width: 150 }]}
                  placeholder="dd.mm.rrrr"
                ></TextInput>
              </View>
            </View>
          </KeyboardAwareScrollView>
          {/* добавить анимации ( желательно поменять на Pressable) */}
          <AnimatedPressable
            style={[styles.button, animatedStyle]}
            onPress={handlePress}
            onPressIn={() => (scale.value = withSpring(0.8))}
            onPressOut={() => (scale.value = withSpring(1))}
          >
            <Text style={{ fontFamily: "PatrickHand-Regular", fontSize: 21 }}>
              Choose Themes
            </Text>
          </AnimatedPressable>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.background,
    flex: 1,
  },

  formContainer: {
    width: "100%",
    height: "85%",
    backgroundColor: Colors.primary2,
    borderRadius: 34,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
  },

  formWrapper: {
    width: "100%",
    height: "75%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 120,
  },

  formText: {
    color: "white",
    fontSize: 33,
    fontFamily: "PatrickHand-Regular",
  },

  inputs: {
    width: 300,
    height: 40,
    borderRadius: 12,
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    marginBottom: 50,
  },

  separator: {
    width: 2,
    borderRadius: 30,
    height: 100,
    margin: 5,
    backgroundColor: "white",
  },

  bottomWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "30%",
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  asideWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "45%",
    height: "100%",
    alignItems: "center",
  },

  button: {
    width: 200,
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors.button2,
    color: "black",
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    padding: 5,
    marginTop: 30,
    justifyContent: "center",
  },
});
