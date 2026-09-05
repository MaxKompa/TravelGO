import Background from "@/src/components/Background";
import ThemeCard from "@/src/components/ThemeCard";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Header from "../../src/components/Header";

export default function Themes() {
  const [isLoading, setIsLoading] = useState(false);

  const themeImages = {
    food: require("@/src/assets/images/foodPic.jpg"),
    afterDark: require("@/src/assets/images/afterDarkPic.jpg"),
    art: require("@/src/assets/images/artPic.jpg"),
    hiking: require("@/src/assets/images/hikingPic.png"),
    history: require("@/src/assets/images/historyPic.jpg"),
  };

  const { country, city, theme, startTrip, endTrip } = useLocalSearchParams();
  const router = useRouter();

  const handleSelectTheme = async (selectedTheme: string) => {
    if (!city || !country || !startTrip || !endTrip) {
      Alert.alert("Missing Data", "Please fill in all the fields in the form!");
      router.push("/home");
      return;
    }
    // объект отправляемый в бекенд
    const fullTripData = {
      country: country,
      city: city,
      start_datetime: startTrip,
      end_datetime: endTrip,
      theme: selectedTheme,
    };

    // функция отправки данных с формы ввода на сервер
    const sendTripData = async (fullTripData: object) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://100.74.232.9:8000/api/plan-trip ",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(fullTripData),
          },
        );

        if (!response.ok) {
          throw new Error(`Server error : ${response.status} `);
        }

        const res = await response.json();
        console.log(
          "Succesfuly server response: ",
          JSON.stringify(res, null, 2),
        );
        return res;
      } catch (error) {
        console.log("Request errror : ", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    // проверка данных
    console.log(
      `data request to server: \n${JSON.stringify(fullTripData, null, 2)}`,
    );

    //функция получения данных с бекенда
    try {
      const listData = await sendTripData(fullTripData);

      if (listData) {
        router.push({
          pathname: "/locations",
          params: {
            listData: JSON.stringify(listData),
          },
        });
      }
    } catch (err) {
      Alert.alert("Error", "Could not fetch trip data from the server.");
    }
  };

  // //анимация появления
  const opacity0 = useSharedValue(0);
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const translateY0 = useSharedValue(50);
  const translateY1 = useSharedValue(50);
  const translateY2 = useSharedValue(50);

  useFocusEffect(
    useCallback(() => {
      opacity0.value = 0;
      opacity1.value = 0;
      opacity2.value = 0;
      translateY0.value = 50;
      translateY1.value = 50;
      translateY1.value = 50;

      opacity0.value = withTiming(1, { duration: 200 });
      translateY0.value = withTiming(0, { duration: 500 });
      opacity1.value = withDelay(300, withTiming(1, { duration: 200 }));
      translateY1.value = withDelay(200, withTiming(0, { duration: 500 }));
      opacity2.value = withDelay(600, withTiming(1, { duration: 200 }));
      translateY2.value = withDelay(500, withTiming(0, { duration: 500 }));
    }, []),
  );

  const style1 = useAnimatedStyle(() => ({
    opacity: opacity0.value,
    transform: [{ translateY: translateY0.value }],
  }));

  const style2 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: translateY1.value }],
  }));

  const style3 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ translateY: translateY2.value }],
  }));

  return (
    <Background>
      <Header text="Themes" />
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ffffff"></ActivityIndicator>
        </View>
      )}

      <View style={styles.wrapper}>
        <Animated.View style={[styles.themeRow, style1]}>
          <ThemeCard
            text={"Food"}
            width={351}
            image={themeImages.food}
            onPress={() => handleSelectTheme("food")}
          />
        </Animated.View>
        <Animated.View style={[styles.themeRow, style2]}>
          <ThemeCard
            text={"History"}
            width={210}
            image={themeImages.history}
            onPress={() => handleSelectTheme("history")}
          />
          <ThemeCard
            text={"Hiking"}
            width={140}
            image={themeImages.hiking}
            onPress={() => handleSelectTheme("hiking")}
          />
        </Animated.View>
        <Animated.View style={[styles.themeRow, style3]}>
          <ThemeCard
            text={"After Dark"}
            width={140}
            image={themeImages.afterDark}
            onPress={() => handleSelectTheme("afterDark")}
          />
          <ThemeCard
            text={"Art"}
            width={210}
            image={themeImages.art}
            onPress={() => handleSelectTheme("art")}
          />
        </Animated.View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },

  themeRow: {
    display: "flex",
    justifyContent: "center",
    padding: 5,
    width: "100%",
    height: "25%",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Полупрозрачный темный фон
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Ставит поверх всех элементов
  },
});
