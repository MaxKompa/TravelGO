import { StyleSheet, Text, View } from "react-native";
import { HeaderProps } from "../../src/types";
import { Colors } from "../theme";

export default function Header({ text }: HeaderProps) {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContent}>
        <Text style={styles.label}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
    elevation: 3,
    position: "absolute",
    zIndex: 1,
    borderBottomColor: Colors.primaryBlured,
    borderBottomWidth: 1,
  },

  headerContent: {
    backgroundColor: Colors.primary,
    height: 75,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
  },

  label: {
    color: "white",
    fontSize: 25,
    zIndex: 2,
    fontFamily: "Merienda-Bold",
  },
});
