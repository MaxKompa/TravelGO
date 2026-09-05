import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme";
import { ContentCardProps } from "../types";

export default function ContentCard({
  height,
  children,
  label,
}: ContentCardProps) {
  return (
    <View style={[styles.contentCard, { height: height }]}>
      <View style={styles.labelBackground}>
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  contentCard: {
    width: "100%",
    borderRadius: 30,
    gap: 10,
    backgroundColor: Colors.background,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  label: {
    fontSize: 28,
    fontFamily: "LabelFont",
    alignSelf: "center",
    includeFontPadding: false,
    paddingVertical: 15,
    paddingHorizontal: 15,
    textAlign: "center",
    color: "white",
  },

  labelBackground: {
    backgroundColor: Colors.primary2,

    width: "105%",
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
  },
});
