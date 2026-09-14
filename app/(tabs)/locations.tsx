import Background from "@/src/components/Background";
import Header from "@/src/components/Header";
import LocationCard from "@/src/components/LocationCard";
import { Colors } from "@/src/theme";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LocationListItem } from "../../src/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DAYS_OF_WEEK = [
  //массив с днями для нахождения расписания
  "Sunday", // 0
  "Monday", // 1
  "Tuesday", // 2
  "Wednesday", // 3
  "Thursday", // 4
  "Friday", // 5
  "Saturday", // 6
];

export default function Locations() {
  const router = useRouter();
  const { listData } = useLocalSearchParams();

  const locationList: LocationListItem[] = useMemo(
    () => (listData ? JSON.parse(listData as string) : []),
    [listData],
  );

  //функция для рендера LocationCard в FlatList
  const renderItem = ({ item }: { item: LocationListItem }) => {
    const currentDate = DAYS_OF_WEEK[new Date().getDay()];
    const formattedShedule = () => {
      const todayShedule = item.hours.find(
        (h) => h.day.toLowerCase() == currentDate.toLowerCase(), // ищет конкретный день и возвращает весь объект из массива hours
      );
      return `${todayShedule?.day} : ${todayShedule?.open_time?.slice(0, 5)} - ${todayShedule?.close_time?.slice(0, 5)}`;
    };

    return (
      <LocationCard
        label={item.name}
        rating={item.google_rating}
        discription={item.description}
        todaySchedule={formattedShedule()}
        photo_url={item.image_url}
        priceAvg={item.price_avg}
        id={item.id}
      />
    );
  };
  //анимация кнопки

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const handlePress = () => {
    setTimeout(() => {
      router.replace("/home");
    }, 150);
  };

  return (
    <Background>
      <Header text="Locations"></Header>
      {locationList && locationList.length > 0 && (
        <>
          <View style={styles.headerBuffer}></View>
          <FlatList
            data={locationList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.flatlist}
          ></FlatList>
        </>
      )}

      {(!locationList || locationList.length === 0) && (
        <View style={styles.noDataCardWrapper}>
          <View style={styles.shadowContainer}>
            <BlurView style={styles.blurCard} intensity={50} tint="light">
              <View style={styles.noDataCard}>
                <Text style={styles.noDataCardText}>
                  Sorry, but you need to fill the form for check the results!
                </Text>
                <AnimatedPressable
                  style={[styles.backButton, animatedStyle]}
                  onPress={() => handlePress()}
                  onPressIn={() => {
                    scale.value = withSpring(0.8);
                  }}
                  onPressOut={() => {
                    scale.value = withSpring(1);
                  }}
                >
                  <Text style={{ fontFamily: "Text", fontSize: 16 }}>
                    Back to the form
                  </Text>
                </AnimatedPressable>
              </View>
            </BlurView>
          </View>
        </View>
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  headerBuffer: {
    width: "100%",
    height: 85,
  },
  flatlist: {
    gap: 20,
    paddingBottom: 100,
    overflow: "hidden",
    paddingTop: 15,
  },

  noDataCardWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  shadowContainer: {
    height: 200,
    width: "85%",
    elevation: 5,
    backgroundColor: "rgba(156, 167, 240, 0.82)",
    borderRadius: 20,
  },

  blurCard: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },

  noDataCard: {
    height: 200,
    backgroundColor: "#bec4e9b6",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 20,
  },

  noDataCardText: {
    fontFamily: "Text",
    fontSize: 20,
    textAlign: "center",
    paddingTop: 30,
  },

  backButton: {
    width: 200,
    height: 45,
    borderRadius: 20,
    backgroundColor: Colors.button2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
});
