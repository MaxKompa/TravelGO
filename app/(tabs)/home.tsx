import Background from "@/src/components/Background";
import { Colors } from "@/src/theme";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Carousel } from "react-native-reanimated-carousel";
import ClearButtonIcon from "../../src/assets/icons/ClearButtonIcon.svg";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const data = [
  {
    id: 1,
    image: require("../../src/assets/images/carousel-images/carousel-image1.jpg"),
  },
  {
    id: 2,
    image: require("../../src/assets/images/carousel-images/carousel-image2.jpg"),
  },
  {
    id: 3,
    image: require("../../src/assets/images/carousel-images/carousel-image3.jpg"),
  },
  {
    id: 4,
    image: require("../../src/assets/images/carousel-images/carousel-image4.jpg"),
  },
  {
    id: 5,
    image: require("../../src/assets/images/carousel-images/carousel-image5.jpg"),
  },
  {
    id: 6,
    image: require("../../src/assets/images/carousel-images/carousel-image6.jpg"),
  },
  {
    id: 7,
    image: require("../../src/assets/images/carousel-images/carousel-image7.jpg"),
  },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  //datepicker
  const [isOpenStart, setIsOpenStart] = useState(false);
  const [isOpenEnd, setIsOpenEnd] = useState(false);

  const formattedStartDate = () => {
    if (!inputData.start_datetime) {
      return "Trip started at..";
    } else {
      return new Date(inputData.start_datetime).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const formattedEndDate = () => {
    if (!inputData.end_datetime) {
      return "Trip ended at..";
    } else {
      return new Date(inputData.end_datetime).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  //BottomSheet menu
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["80%"], []);

  //button animation
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const router = useRouter();
  const [inputData, setInputData] = useState({
    country: "",
    city: "",
    start_datetime: "",
    end_datetime: "",
    theme: "",
  });

  const handlePressChooseThemes = () => {
    setTimeout(() => {
      router.push({
        pathname: "/themes",
        params: {
          country: inputData.country,
          city: inputData.city,
          theme: inputData.theme,
          startTrip: inputData.start_datetime,
          endTrip: inputData.end_datetime,
        },
      });
    }, 220);
  };

  const handlePressStartTrip = () => {
    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 220);
  };

  const handlePressClear = (area: string) => {
    switch (area) {
      case "Country": {
        setInputData((prev) => ({
          ...prev,
          country: "",
        }));
        break;
      }
      case "City": {
        setInputData((prev) => ({
          ...prev,
          city: "",
        }));
        break;
      }
      case "Start": {
        setInputData((prev) => ({
          ...prev,
          start_datetime: "",
        }));
        break;
      }
      case "End": {
        setInputData((prev) => ({
          ...prev,
          end_datetime: "",
        }));
        break;
      }
    }
  };

  useEffect(() => {
    console.log(inputData);
  }, [inputData]);

  return (
    <Background>
      {/* main page */}
      <Carousel
        style={{ width, height: 500 }}
        data={data}
        loop
        autoplay={true}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.carouselCard, { width: width + 2 }]}>
            <Image
              source={item.image}
              resizeMode="cover"
              style={styles.carouselImage}
            />
            <LinearGradient
              style={StyleSheet.absoluteFillObject}
              colors={["#00000000", "#000000d8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            ></LinearGradient>
          </View>
        )}
      />
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>
          Focus on the feeling, leave the location to us.
        </Text>
      </View>

      <View style={[styles.buttonContainer, { width: width - 20 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.contentText}>Where to and when?</Text>

          <View style={styles.separator}></View>

          <Text style={styles.contentText}>
            Set your travel details to get personalized recommendations.
          </Text>
        </View>

        <AnimatedPressable
          style={[styles.button, animatedStyle]}
          onPress={handlePressStartTrip}
          onPressIn={() => (scale.value = withSpring(0.8))}
          onPressOut={() => (scale.value = withSpring(1))}
        >
          <Text style={{ fontFamily: "Text", fontSize: 23 }}>Start Trip</Text>
        </AnimatedPressable>
      </View>

      {/* bottom sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.formContainer}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            {/* COUNTRY */}
            <Text style={[styles.contentText, { fontSize: 20 }]}>
              Select Country:
            </Text>
            <View style={styles.inputsWrapper}>
              <TextInput
                value={inputData.country}
                style={styles.inputs}
                placeholder="np.Poland"
                placeholderTextColor={Colors.text}
                onChangeText={(text: string) =>
                  setInputData((prev) => ({
                    ...prev,
                    country: text,
                  }))
                }
              />
              <Pressable
                style={styles.clearButton}
                onPress={() => handlePressClear("Country")}
              >
                <ClearButtonIcon width={13} height={13} color={Colors.text} />
              </Pressable>
            </View>

            {/* CITY */}
            <Text style={[styles.contentText, { fontSize: 20 }]}>
              Select City:
            </Text>
            <View style={styles.inputsWrapper}>
              <TextInput
                value={inputData.city}
                style={styles.inputs}
                placeholder="np.Katowice"
                placeholderTextColor={Colors.text}
                onChangeText={(text: string) =>
                  setInputData((prev) => ({
                    ...prev,
                    city: text,
                  }))
                }
              />
              <Pressable
                style={styles.clearButton}
                onPress={() => handlePressClear("City")}
              >
                <ClearButtonIcon width={13} height={13} color={Colors.text} />
              </Pressable>
            </View>
            <View style={styles.datePickerWrapper}>
              {/* START DATE */}
              <View>
                <Text style={[styles.contentText, { fontSize: 20 }]}>
                  Start time:
                </Text>
                <View style={styles.inputsWrapper}>
                  <Pressable
                    style={[
                      styles.inputs,
                      {
                        width: 150,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingLeft: 15,
                      },
                    ]}
                    onPress={() => setIsOpenStart(true)}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#00000059",
                        fontFamily: "Text",
                      }}
                    >
                      {formattedStartDate()}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.clearButton}
                    onPress={() => handlePressClear("Start")}
                  >
                    <ClearButtonIcon
                      width={13}
                      height={13}
                      color={Colors.text}
                    />
                  </Pressable>
                </View>
                <DateTimePickerModal
                  isVisible={isOpenStart}
                  mode="datetime"
                  locale="en_GB"
                  onConfirm={(selectedDate) => {
                    setInputData((prev) => ({
                      ...prev,
                      start_datetime: selectedDate.toISOString(),
                    }));
                    setIsOpenStart(false);
                  }}
                  onCancel={() => {
                    setIsOpenStart(false);
                  }}
                />
              </View>
              {/* END DATE */}
              <View>
                <Text style={[styles.contentText, { fontSize: 20 }]}>
                  End time:
                </Text>
                <View style={styles.inputsWrapper}>
                  <Pressable
                    style={[
                      styles.inputs,
                      {
                        width: 150,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingLeft: 15,
                      },
                    ]}
                    onPress={() => setIsOpenEnd(true)}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: Colors.text,
                        fontFamily: "Text",
                      }}
                    >
                      {formattedEndDate()}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.clearButton}
                    onPress={() => handlePressClear("End")}
                  >
                    <ClearButtonIcon
                      width={13}
                      height={13}
                      color={Colors.text}
                    />
                  </Pressable>
                </View>
                <DateTimePickerModal
                  isVisible={isOpenEnd}
                  mode="datetime"
                  locale="en_GB"
                  onConfirm={(selectedDate) => {
                    setInputData((prev) => ({
                      ...prev,
                      end_datetime: selectedDate.toISOString(),
                    }));
                    setIsOpenEnd(false);
                  }}
                  onCancel={() => {
                    setIsOpenEnd(false);
                  }}
                />
              </View>
            </View>
            <AnimatedPressable
              style={[
                styles.button,
                animatedStyle,
                { width: 210, backgroundColor: Colors.primary },
              ]}
              onPress={handlePressChooseThemes}
              onPressIn={() => (scale.value = withSpring(0.8))}
              onPressOut={() => (scale.value = withSpring(1))}
            >
              <Text
                style={{ fontFamily: "Text", fontSize: 30, color: "white" }}
              >
                Submit
              </Text>
            </AnimatedPressable>
          </KeyboardAwareScrollView>
        </BottomSheetView>
      </BottomSheet>
    </Background>
  );
}

const styles = StyleSheet.create({
  carouselCard: {
    flex: 1,
    overflow: "hidden",
  },

  carouselImage: {
    height: "100%",
    width: "100%",
  },

  labelContainer: {
    position: "absolute",
    top: 400,
    width: "100%",
    height: 90,
    paddingHorizontal: 10,
    paddingRight: 40,
  },

  labelText: {
    fontSize: 32,
    fontFamily: "LabelFont",
    color: "white",
  },

  contentText: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.text,
    fontFamily: "Text",
  },

  buttonContainer: {
    height: 220,
    marginTop: 15,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
    margin: 2,
    padding: 15,
    alignSelf: "center",
    elevation: 1,
  },
  button: {
    width: 300,
    height: 55,
    borderRadius: 20,
    backgroundColor: Colors.button1,
    color: "black",
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 4,
  },

  separator: {
    width: 100,
    borderRadius: 30,
    height: 2,
    backgroundColor: "#0000007a",
    margin: 10,
    alignSelf: "center",
  },

  formContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.secondary,
    justifyContent: "flex-start",
    paddingTop: 30,
  },

  inputsWrapper: {
    margin: 10,
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
  },

  inputs: {
    width: 300,
    height: 40,
    borderRadius: 12,
    backgroundColor: "white",
    padding: 10,
    color: "#535353",
  },

  clearButton: {
    width: 20,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 7,
  },

  datePickerWrapper: {
    height: 150,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});
