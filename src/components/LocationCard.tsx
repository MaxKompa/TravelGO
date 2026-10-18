import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../theme";
import { LocationCardProps, OperationHours } from "../types";
import AddButton from "./AddButton";

export default function LocationCard({
  fullSchedule,
  label,
  discription,
  photo_url,
  rating,
  priceAvg,
  todaySchedule,
  id,
}: LocationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [buttonSwap, setButtonSwap] = useState(true); //true = More Info; false = Close;

  const buttonText = buttonSwap ? "More Info" : "Close";

  const progress = useSharedValue(0);

  const clearFullSchedule = (fullSchedule: OperationHours[]) => {
    return fullSchedule.map((item) => (
      <View key={item.day} style={{ width: "100%", flexDirection: "row" }}>
        <View style={{ margin: 0, padding: 0, width: "30%", marginRight: 5 }}>
          <Text style={styles.infoText}>{item.day}</Text>
        </View>
        <View>
          <Text
            style={styles.infoText}
          >{`${item.open_time?.slice(0, 5)} : ${item.close_time?.slice(0, 5)}`}</Text>
        </View>
      </View>
    ));
  };

  const toggleAnimation = () => {
    const nextState = !isExpanded;
    const nextButtonSwap = !buttonSwap;
    setIsExpanded(nextState);
    setButtonSwap(nextButtonSwap);

    progress.value = withTiming(nextState ? 1 : 0, { duration: 400 });
  };

  const animatedImage = useAnimatedStyle(() => {
    const heightPercent = interpolate(progress.value, [0, 1], [70, 50]);
    return {
      height: `${heightPercent}%`,
    };
  });

  const animatedCardWrapper = useAnimatedStyle(() => {
    const heightPcs = interpolate(progress.value, [0, 1], [430, 470]);
    return {
      height: heightPcs,
    };
  });

  const animatedInfoBlock = useAnimatedStyle(() => {
    const heightPercent = interpolate(progress.value, [0, 1], [30, 50]);
    return {
      height: `${heightPercent}%`,
    };
  });

  return (
    <Animated.View style={[styles.cardWrapper, animatedCardWrapper]}>
      <Animated.View style={[styles.imgWrapper, animatedImage]}>
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
                style={[styles.labelText, { fontSize: 23, textAlign: "right" }]}
              >{`Average price: ~${priceAvg} zl`}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
      <Animated.View style={[styles.infoConteiner, animatedInfoBlock]}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLable}>{`Discription: ${discription}`}</Text>
          <Text style={styles.infoText}>{`Rating: ${rating}`}</Text>
          <Text style={styles.infoLable}>Open time:</Text>
          {/* сегодняшнее или все доступное расписание  */}
          {isExpanded ? (
            <View style={{ width: "95%" }}>
              {clearFullSchedule(fullSchedule)}
            </View>
          ) : (
            <Text style={styles.infoText}>{todaySchedule} </Text>
          )}

          <Pressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={toggleAnimation}
            style={{
              height: 20,
              width: 100,
            }}
          >
            <Text
              style={{ fontFamily: "Text", fontSize: 12, color: Colors.text2 }}
            >
              {/* more info or close text */}
              {buttonText}
            </Text>
          </Pressable>
        </View>
        <View style={styles.buttonArea}>
          <AddButton />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: "5%",
  },

  image: {
    flex: 1,
    padding: 20,
  },

  imgWrapper: {
    width: "100%",
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
    backgroundColor: "white",
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    padding: 5,
    paddingHorizontal: 15,
    overflow: "hidden",
    flexDirection: "row",
  },

  infoBlock: {
    width: "80%",
    gap: 3,
  },

  buttonArea: {
    flex: 1,
    justifyContent: "center",
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
