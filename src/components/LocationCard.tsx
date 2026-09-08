import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { LocationCardProps } from "../types";

export default function LocationCard({
  label,
  discription,
  photo_url,
  rating,
  priceAvg,
  shedule,
  id,
}: LocationCardProps) {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.imgWrapper}>
        <ImageBackground
          style={styles.image}
          source={{ uri: photo_url }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["#0000008a", "#ffffff13"]}
            start={{ x: 0.4, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={[
              StyleSheet.absoluteFillObject,
              { padding: 20, justifyContent: "space-between" },
            ]}
          >
            <View style={styles.labelConteiner}>
              <Text style={styles.labelText}>{label}</Text>
            </View>

            <View style={styles.priceConteiner}>
              <Text
                style={styles.labelText}
              >{`Average price: ~${priceAvg} zl`}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
      <View style={styles.infoConteiner}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLable}>{`Discription: ${discription}`}</Text>
          <Text style={styles.infoText}>{`Rating: ${rating}`}</Text>
          <Text style={styles.infoLable}>Open time:</Text>
          <Text style={styles.infoText}>{shedule}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    height: 400,
    flexDirection: "column",
    paddingHorizontal: "5%",
  },

  image: {
    flex: 1,
    padding: 20,
  },

  imgWrapper: {
    width: "100%",
    height: "70%",
    overflow: "hidden",
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
  },

  labelConteiner: {
    width: "100%",
  },
  priceConteiner: {
    width: "80%",
    alignSelf: "flex-end",

    alignItems: "flex-end",
  },

  labelText: {
    width: "75%",
    fontFamily: "LabelFont",
    fontSize: 25,
    color: "white",
  },

  infoConteiner: {
    width: "100%",
    height: "30%",
    backgroundColor: "white",
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    padding: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
  },

  infoBlock: {
    width: "80%",
    gap: 3,
  },

  infoLable: {
    fontSize: 17,
    fontFamily: "Text",
  },

  infoText: {
    fontSize: 13,
    fontFamily: "Text",
  },
});
