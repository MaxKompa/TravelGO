import { StyleSheet, View } from "react-native";
import { Colors } from "../../src/theme";
import { BackgroundProps } from "../../src/types";

export default function Background({ children }: BackgroundProps) {
  return <View style={styles.background}>{children}</View>;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});
