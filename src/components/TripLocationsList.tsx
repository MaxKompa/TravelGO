import { Image, StyleSheet, Text, View } from "react-native";
import { useTripState } from "../store/useTripState";
import { Colors } from "../theme";
import TripItem from "./TripItem";

export default function TripLocationsList() {
  const selectedLocations = useTripState((state) => state.selectedLocations);

  return (
    <View style={styles.background}>
      {selectedLocations.length > 1 ? (
        selectedLocations.map((loc) => <TripItem itemName={loc.name} />)
      ) : (
        <View style={styles.emptyArrayInfoBackground}>
          <Text style={styles.text}>
            Your travel map is waiting for the first spot...
          </Text>
          <View style={styles.imageWrap}>
            <Image
              source={require("@/src/assets/images/EmptyMapImg.jpg")}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "90%",
    height: "100%",
    alignSelf: "center",
  },

  emptyArrayInfoBackground: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  text: {
    fontFamily: "Text",
    fontSize: 22,
    alignSelf: "center",
    textAlign: "center",
    color: Colors.text,
  },
  imageWrap: {
    width: 100,
    height: 100,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
