import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeCardProps } from "../types";

export default function ThemeCard({
  text,
  width,
  image,
  onPress,
}: ThemeCardProps) {
  return (
    <View renderToHardwareTextureAndroid={true}>
      <TouchableOpacity
        style={[styles.card, { width: width }]}
        onPress={onPress}
      >
        <ImageBackground
          style={styles.backgroundImage}
          source={image}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["#000000b9", "#00000028"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={[StyleSheet.absoluteFillObject, styles.textBackground]}
          >
            <Text style={styles.cardText}>{text}</Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    height: "100%",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    margin: 4,
    overflow: "hidden",
  },

  cardText: {
    fontSize: 32,
    fontFamily: "LabelFont",
    alignSelf: "flex-start",
    color: "#e6e1d6",
  },

  textBackground: {
    justifyContent: "flex-end",
    padding: 15,
    paddingBottom: 5,
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
});
