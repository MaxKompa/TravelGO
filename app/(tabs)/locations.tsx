import Background from "@/src/components/Background";
import Header from "@/src/components/Header";
import LocationCard from "@/src/components/LocationCard";
import { FlatList, StyleSheet } from "react-native";
import { DataItem } from "../../src/types";

//изменить потом на запрос с бека
const MOCK_PLACES = [
  {
    id: "1",
    label: "Podwale 25",
    googleRewiew: "Google: 4.8",
    travelGoRewiew: "TravelGo: 4.9",
    specification: "Meat & Beer",
    shedule: [
      "Pon. 10:00 – 22:00",
      "Sob. 11:00 – 23:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
    ],
  },
  {
    id: "2",
    label: "Manekin",
    googleRewiew: "Google: 4.5",
    travelGoRewiew: "TravelGo: 4.3",
    specification: "Pancakes",
    shedule: [
      "Pon. 10:00 – 22:00",
      "Sob. 11:00 – 23:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
    ],
  },
  {
    id: "3",
    label: "Zapiecek",
    googleRewiew: "Google: 4.6",
    travelGoRewiew: "TravelGo: 4.7",
    specification: "Pierogi",
    shedule: [
      "Pon. 10:00 – 22:00",
      "Sob. 11:00 – 23:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
    ],
  },

  {
    id: "4",
    label: "Podwale 25",
    googleRewiew: "Google: 4.8",
    travelGoRewiew: "TravelGo: 4.9",
    specification: "Meat & Beer",
    shedule: [
      "Pon. 10:00 – 22:00",
      "Sob. 11:00 – 23:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
      "Pon. 10:00 – 22:00",
    ],
  },
];

export default function Locations() {
  const renderItem = ({ item }: { item: DataItem }) => {
    return (
      <LocationCard
        label={item.label}
        googleRewiew={item.googleRewiew}
        travelGoRewiew={item.travelGoRewiew}
        specification={item.specification}
        shedule={item.shedule}
      />
    );
  };

  return (
    <Background>
      <Header text="Locations"></Header>
      <FlatList
        data={MOCK_PLACES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.wrapper}
      ></FlatList>
    </Background>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingTop: 90,
    paddingBottom: 100,
  },
});
