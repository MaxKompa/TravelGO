import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme";

export default function TripItem(props: { itemName: string }) {
  return (
    <View style={styles.itemConteiner}>
      <View style={styles.itemLabel}>
        <Text
          style={{ fontFamily: "Text", textAlign: "center", color: "white" }}
        >
          {props.itemName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemConteiner: {
    height: 50,
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    marginBottom: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
  itemLabel: {
    padding: 5,
    width: "80%",
  },
});
