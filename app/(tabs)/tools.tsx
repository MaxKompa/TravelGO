import Background from "@/src/components/Background";
import CashConverter from "@/src/components/CashConverter";
import Header from "@/src/components/Header";
import ToolsListOption from "@/src/components/ToolsListOption";
import { Colors } from "@/src/theme";
import BottomSheet, {
  BottomSheetBackdrop
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ToolsMenu() {
  // (gorchom) боттом меню
  const [selectedPage, setSelectedPage] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenPress = (page: string) => {
    setSelectedPage(page);
    bottomSheetRef.current?.expand();
  };
  const snapPoints = useMemo(() => ["85%"], []);
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

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedPage("");
      bottomSheetRef.current?.close();
    }
  }, []);
  //функция: какую опцию зарендерить (поменять потом на скрины)
  const renderBottomPage = () => {
    switch (selectedPage) {
      case "tripCost":
        return (
          <Text style={{ alignSelf: "center", fontSize: 20 }}>
            Trip Cost page!
          </Text>
        );
      case "translator":
        return (
          <Text style={{ alignSelf: "center", fontSize: 20 }}>
            Translator Page!
          </Text>
        );
      case "localLaws":
        return (
          <Text style={{ alignSelf: "center", fontSize: 20 }}>
            Local Laws Page!
          </Text>
        );

      case "converter":
        return <CashConverter />;
      default:
        return null;
    }
  };

  return (
    <Background>
      <Header text="Tools" />
      <View style={styles.toolsListContainer}>
        <ToolsListOption
          title="Trip Cost"
          handleOpenPress={() => handleOpenPress("tripCost")}
        />
        <ToolsListOption
          title="Translator"
          handleOpenPress={() => handleOpenPress("translator")}
        />
        <ToolsListOption
          title="Local laws"
          handleOpenPress={() => handleOpenPress("localLaws")}
        />
        <ToolsListOption
          title="Converter"
          handleOpenPress={() => handleOpenPress("converter")}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackDrop}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
      >
        {renderBottomPage()}
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
