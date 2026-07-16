import Background from "@/src/components/Background";
import ThemeCard from "@/src/components/ThemeCard";
import { StyleSheet, View } from "react-native";
import Header from "../../src/components/Header";

export default function Themes() {
  return (
    <Background>
      <Header text="Themes" />
      <View style={styles.wrapper}>
        <View style={[styles.themeRow, { marginTop: 120 }]}>
          <ThemeCard text={"Food"} width={351} />
        </View>
        <View style={styles.themeRow}>
          <ThemeCard text={"History"} width={210} />
          <ThemeCard text={"Hiking"} width={140} />
        </View>
        <View style={styles.themeRow}>
          <ThemeCard text={"After Dark"} width={140} />
          <ThemeCard text={"Art"} width={210} />
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
