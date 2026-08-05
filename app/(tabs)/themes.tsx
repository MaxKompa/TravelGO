import Background from "@/src/components/Background";
import ThemeCard from "@/src/components/ThemeCard";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import Header from "../../src/components/Header";

export default function Themes() {
  const themeImages = {
    food: require("@/src/assets/images/foodPic.jpg"),
    afterDark: require("@/src/assets/images/afterDarkPic.jpg"),
    art: require("@/src/assets/images/artPic.jpg"),
    hiking: require("@/src/assets/images/hikingPic.png"),
    history: require("@/src/assets/images/historyPic.jpg"),
  };

  const { country, city, theme } = useLocalSearchParams();

  const handleSelectTheme = (selectedTheme: string) => {
    const fullTripData = {
      country: country,
      city: city,
      start_datetime: "2026-08-03T10:00.274Z",
      end_datetime: "2026-08-03T18:00.274Z",
      theme: selectedTheme,
    };

    console.log(fullTripData);
  };

  return (
    <Background>
      <Header text="Themes" />
      <View style={styles.wrapper}>
        <View style={[styles.themeRow, { marginTop: 120 }]}>
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
  },

  themeRow: {
    display: "flex",
    justifyContent: "center",
    padding: 5,
    margin: 10,
    width: "100%",
    height: "24%",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
