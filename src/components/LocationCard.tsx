import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../src/theme";
import { LocationCardProps } from "../types";

export default function LocationCard({
  label,
  googleRewiew,
  travelGoRewiew,
  specification,
  shedule,
}: LocationCardProps) {
  return (
    <View style={styles.cardBackground}>
      <View style={styles.disc}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.separator}></View>

        <View>
          <View style={styles.reviewWraper}>
            <Text style={styles.rewiewText}>{googleRewiew}</Text>
            <Text style={styles.rewiewText}>{travelGoRewiew}</Text>
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              width: "100%",
              paddingLeft: 10,
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <Text style={styles.timeText}>{shedule.join("\n")}</Text>
          </View>
          <View style={styles.separator}></View>
        </View>

        <Text style={[styles.label, { fontSize: 18, padding: 10 }]}>
          {specification}
        </Text>
      </View>
      {/* конец описания  */}
      <View style={styles.imageWrapper}>
        {/* пока что статичная фотография, даьше поменять на ссылку с бека  */}
        <Image
          source={require("../assets/eventImage1.jpg")}
          style={styles.cardImage}
        />
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={{ fontSize: 21 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "blue",
    marginTop: 160,
  },
  cardBackground: {
    backgroundColor: Colors.secondary,
    margin: 20,
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "85%",
    elevation: 5,
  },
  disc: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: Colors.errors,
    width: "50%",
    borderRadius: 20,
    alignItems: "center",
    padding: 7,
    marginRight: 10,
    justifyContent: "space-between",
  },
  label: {
    padding: 10,
    fontSize: 22,
    color: "white",
    textAlign: "center",
    textShadowColor: "black",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
    fontFamily: "Agbalumo-Regular",
  },

  separator: {
    width: 70,
    height: 2,
    backgroundColor: "#eaeaeab6",
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  reviewWraper: {
    marginTop: 5,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  rewiewText: {
    fontSize: 11,
    margin: 5,
    color: "white",
    textAlign: "center",
    fontFamily: "Agbalumo-Regular",
  },

  timeText: {
    fontSize: 10,
    color: "white",
    fontFamily: "Agbalumo-Regular",
  },

  imageWrapper: {
    width: "48%",
    backgroundColor: "red",
    borderRadius: 20,
    marginLeft: 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    aspectRatio: 0.5,
  },

  cardImage: {
    borderRadius: 20,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },

  addButton: {
    position: "absolute",
    top: "92%",
    height: 45,
    width: 45,
    borderRadius: 15,
    backgroundColor: Colors.button2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
