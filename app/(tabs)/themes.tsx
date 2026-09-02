import Background from "@/src/components/Background";
import ThemeCard from "@/src/components/ThemeCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
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
    if (!city || !country) {
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

  return (
    <Background>
      <Header text="Themes" />
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ffffff"></ActivityIndicator>
        </View>
      )}
      <View style={styles.wrapper}>
        <View style={[styles.themeRow]}>
          <ThemeCard
            text={"Food"}
            width={351}
            image={themeImages.food}
            onPress={() => handleSelectTheme("food")}
          />
        </View>
        <View style={styles.themeRow}>
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
        </View>
        <View style={styles.themeRow}>
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
        </View>
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
