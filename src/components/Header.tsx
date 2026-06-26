import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../src/theme";
import { HeaderProps } from "../../src/types";

export default function Header({ text }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.label}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 100,
    backgroundColor: Colors.primary,
    position: "absolute",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "white",
    fontSize: 30,
    zIndex: 2,
  },
});
