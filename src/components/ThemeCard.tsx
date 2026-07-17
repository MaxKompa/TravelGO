import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../theme";
import { ThemeCardProps } from "../types";

export default function ThemeCard({ text, width }: ThemeCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { width: width }]}>
      <Text style={styles.cardText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    height: "100%",
    borderRadius: 20,
    borderColor: Colors.primary2,
    borderWidth: 3,
    margin: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: {
    fontSize: 25,
    fontFamily: "PatrickHand-Regular",
  },
});
