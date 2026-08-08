import Background from "@/src/components/Background";
import Header from "@/src/components/Header";
import LocationCard from "@/src/components/LocationCard";
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet } from "react-native";
import { DataItem } from "../../src/types";

//изменить потом на запрос с бека

export default function Locations() {
  const params = useLocalSearchParams(); // сделать через деструктуризацию

  const locationList: DataItem[] = params.listData
    ? JSON.parse(params.listData as string)
    : []; //разобраться с стригфай и парсинге.
  const renderItem = ({ item }: { item: DataItem }) => {
    const open = item.open_time ? item.open_time.slice(0, 5) : "";
    const close = item.close_time ? item.close_time.slice(0, 5) : "";
    const scheduleString =
      open && close ? `${open} - ${close}` : "Время не указано";

    return (
      <LocationCard
        label={item.name}
        // googleRewiew={item.googleRewiew}
        // travelGoRewiew={item.travelGoRewiew}
        rating={item.rating}
        short_description={item.short_description}
        shedule={item.shedule}
        photo_url={item.photo_url}
      />
    );
  };

  return (
    <Background>
      <Header text="Locations"></Header>
      <FlatList
        data={locationList}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
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
