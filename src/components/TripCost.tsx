import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
    FadeOutRight,
    LinearTransition,
} from "react-native-reanimated";
import { useTripState } from "../store/useTripState";
import { Colors } from "../theme";
import ContentCard from "./ContentCard";
export default function TripCost() {
  const [totalPrice, setTotalPrice] = useState(0);
  const selectedPlaces = useTripState((state) => state.selectedLocations);
  const removeLocation = useTripState((state) => state.removeLocation);

  const formattedSelectedPlaces = selectedPlaces.map((item) => {
    return (
      <Animated.View
        key={item.id}
        style={styles.listItem}
        layout={LinearTransition.springify()}
        exiting={FadeOutRight.duration(300)}
      >
        <Text style={styles.nameOfPlaceText}>{item.name}</Text>
        <Text style={styles.avgPriceText}>{`~${item.price_avg}zl`}</Text>
        <Pressable
          onPress={() => removeLocation(item.id)}
          style={styles.removeButton}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Text",
              fontSize: 10,
              color: "white",
            }}
          >
            X
          </Text>
        </Pressable>
      </Animated.View>
    );
  });

  // пересчет среднего чека
  const calcTotalPrice = () => {
    const prices = selectedPlaces.map((item) => Number(item.price_avg));
    let sum = 0;
    for (const price of prices) {
      sum += price;
    }

    return sum;
  };
  useEffect(() => {
    const res = calcTotalPrice();
    setTotalPrice(res);
  }, [selectedPlaces]);

  return (
    <ContentCard label={"Trip Cost"} height={600}>
      <View style={styles.totalPriceBlock}>
        <Text
          style={styles.totalPriceText}
        >{`Total bill: ~${totalPrice} zl`}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: "10%",
          justifyContent: "center",
          alignItems: "center",
        }}
        style={{ alignSelf: "center" }}
      >
        {formattedSelectedPlaces}
      </ScrollView>
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 15,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    alignItems: "center",
  },

  nameOfPlaceText: {
    width: "70%",
    fontFamily: "LabelFont",
    fontSize: 18,
    color: Colors.text3,
    textAlign: "left",
  },
  avgPriceText: {
    fontFamily: "Text",
    color: Colors.text2,
    fontSize: 17,
  },

  totalPriceBlock: {
    width: "75%",
    height: 60,
    borderRadius: 10,
    backgroundColor: "#0bcc0b9f",
    marginBottom: 15,
    justifyContent: "center",
  },

  totalPriceText: {
    fontSize: 25,
    textAlign: "center",
    padding: 10,
    color: Colors.text3,
    fontFamily: "Text",
  },

  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#e91f1fda",
    justifyContent: "center",
  },
});
