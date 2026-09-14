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
import { LocationCardProps } from "../types";

export default function LocationCard({
  label,
  discription,
  photo_url,
  rating,
  priceAvg,
  todaySchedule,
  id,
}: LocationCardProps) {
  const [text, setText] = useState(todaySchedule);
  const [isExpanded, setIsExpanded] = useState(false);

  const progress = useSharedValue(0);

  const updateText = (expanded: boolean) => {
    setText(
      expanded
        ? `monday: ;;; \n tuesday : ;;; \n thirthday: ;;; \n satuday: ;;; \n friday: ;;; \n subbota: ;;; \n sunday: ;;;`
        : todaySchedule,
    );
  };

  const toggleAnimation = () => {
    console.log("button pressed");
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    progress.value = withTiming(nextState ? 1 : 0, { duration: 400 });
    updateText(nextState);
  };

  const animatedImage = useAnimatedStyle(() => {
    const heightPercent = interpolate(progress.value, [0, 1], [70, 50]);
    return {
      height: `${heightPercent}%`,
    };
  });

  const animatedCardWrapper = useAnimatedStyle(() => {
    const heightPcs = interpolate(progress.value, [0, 1], [400, 450]);
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
          <Text style={styles.infoText}>{text}</Text>
          <Pressable
            onPress={toggleAnimation}
            style={{
              height: 15,
              width: 100,
              borderColor: "black",
              borderWidth: 1,
            }}
          >
            <Text>click</Text>
          </Pressable>
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
