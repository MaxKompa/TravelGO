import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";
import { HeaderProps } from "../../src/types";
import { Colors } from "../theme";

export default function Header({ text }: HeaderProps) {
  return (
    <View style={styles.headerWrapper}>
      <BlurView
        intensity={65}
        tint="default"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.headerContent}>
        <Text style={styles.label}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
    backgroundColor: "transparment",
    overflow: "hidden",
    elevation: 3,
    position: "absolute",
    zIndex: 1,
    borderBottomColor: Colors.primaryBlured,
    borderBottomWidth: 1,
  },

  headerContent: {
    backgroundColor: Colors.primaryBlured,
    height: 80,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
  },

  label: {
    color: "white",
    fontSize: 30,
    zIndex: 2,
    fontWeight: "bold",
  },
});
