import Background from "@/src/components/Background";
import Header from "@/src/components/Header";
import LocationCard from "@/src/components/LocationCard";
import { Colors } from "@/src/theme";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { DataItem } from "../../src/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Locations() {
  const router = useRouter();
  const { listData } = useLocalSearchParams();

  const locationList: DataItem[] = listData
    ? JSON.parse(listData as string)
    : []; //использовать useMemo для кеширования

  //функция для рендера LocationCard в FlatList
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
        shedule={scheduleString}
        photo_url={item.photo_url}
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
    }, 230);
  };

  return (
    <Background>
      <Header text="Locations"></Header>
      {locationList && locationList.length > 0 && (
        <FlatList
          data={locationList}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.wrapper}
        ></FlatList>
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
                  <Text>Back to the form</Text>
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
  wrapper: {
    alignItems: "center",
    paddingTop: 90,
    paddingBottom: 100,
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
    padding: 10,
    borderRadius: 20,
  },

  noDataCardText: {
    fontFamily: "PatrickHand-Regular",
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
