import Background from "@/src/components/Background";
import Header from "@/src/components/Header";
import TripItem from "@/src/components/TripItem";
import { Colors } from "@/src/theme";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MapScreen() {
  const snapPoints = useMemo(() => ["30%", "65%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <Background>
      <Header text="Map" />
      <View style={styles.mapConteiner}>
        <Text>Map</Text>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        overDragResistanceFactor={10}
        enableDynamicSizing={false}
      >
        <View style={styles.buttonConteiner}>
          <Pressable style={styles.navButton}></Pressable>
          <Pressable style={styles.navButton}></Pressable>
          <Pressable style={styles.navButton}></Pressable>
          <Pressable style={styles.navButton}></Pressable>
        </View>

        <BottomSheetScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            paddingBottom: 70,
            paddingTop: 10,
          }}
        >
          <TripItem></TripItem>
          <View style={styles.separator}></View>
          <TripItem></TripItem>
          <View style={styles.separator}></View>
          <TripItem></TripItem>
          <View style={styles.separator}></View>
          <TripItem></TripItem>
          <View style={styles.separator}></View>
          <TripItem></TripItem>
          <View style={styles.separator}></View>
          <TripItem></TripItem>
          <View style={styles.separator}></View>
          <TripItem></TripItem>
          <View style={styles.separator}></View>
          <TripItem></TripItem>
          <View style={styles.separator}></View>
          <TripItem></TripItem>
          <View style={styles.separator}></View>
          <TripItem></TripItem>
        </BottomSheetScrollView>
      </BottomSheet>
      {/* <View style={styles.infoConteiner}></View> */}
    </Background>
  );
}

const styles = StyleSheet.create({
  mapConteiner: {
    marginTop: 100,
    width: "100%",
    flex: 1,
    backgroundColor: Colors.text,
  },

  buttonConteiner: {
    width: "90%",
    alignSelf: "center",
    padding: 5,
    justifyContent: "space-between",
    flexDirection: "row",
  },

  navButton: {
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
  },

  scrollView: {
    width: "100%",
    flex: 1,
  },
  separator: {
    width: 2,
    height: 30,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
});
