import Background from "@/src/components/Background";
import Header from "@/src/components/Header";
import ToolsListOption from "@/src/components/ToolsListOption";
import { Colors } from "@/src/theme";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ToolsMenu() {
  // (gorchom) боттом меню
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const snapPoints = useMemo(() => ["50%", "75%"], []);
  const renderBackDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  // Принудительное закрытие, если индекс становится меньше 0
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      bottomSheetRef.current?.close();
    }
  }, []);

  return (
    <Background>
      <Header text="Tools" />

      <View style={styles.toolsListContainer}>
        <ToolsListOption title="Trip Cost" handleOpenPress={handleOpenPress} />
        <ToolsListOption title="Translator" handleOpenPress={handleOpenPress} />
        <ToolsListOption title="Local laws" handleOpenPress={handleOpenPress} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackDrop}
        onChange={handleSheetChanges}
      >
        <BottomSheetView>
          <Text>Hello World!</Text>
        </BottomSheetView>
      </BottomSheet>
    </Background>
  );
}

const styles = StyleSheet.create({
  toolsListContainer: {
    marginVertical: 120,
    flex: 1,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryBlured,
    alignItems: "center",
    padding: 20,
    flexDirection: "column",
  },
});
