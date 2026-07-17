import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../theme";
import { ThemeCardProps } from "../types";

export default function ThemeCard({ text, width, image }: ThemeCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { width: width }]}>
      <ImageBackground
        style={styles.backgroundImage}
        source={image}
        resizeMode="cover"
      >
        <View style={styles.textBackground}>
          <Text style={styles.cardText}>{text}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    height: "100%",
    borderRadius: 20,
    borderColor: Colors.primary2,
    borderWidth: 2,
    margin: 4,
    overflow: "hidden",
    elevation: 3,
  },

  cardText: {
    fontSize: 24,
    fontFamily: "PatrickHand-Regular",
    alignSelf: "center",
    color: "#e6e1d6",
  },

  textBackground: {
    backgroundColor: "#00000080",
    width: 120,
    alignSelf: "center",
    borderRadius: 10,
    padding: 5,
  },

  backgroundImage: {
    width: "102%",
    height: "102%",
    justifyContent: "center",
  },
});
