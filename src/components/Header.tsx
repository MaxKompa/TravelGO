import { usePathname } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderProps } from "../../src/types";
import AccountButton from "./AccountButton";
import LogoutButton from "./LogoutButton";

export default function Header({ text, setIsConfirmModalOpen }: HeaderProps) {
  const path = usePathname();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log("path had changed!");
  }, [path]);

  return (
    <View style={[styles.headerBackground, { paddingTop: insets.top + 5 }]}>
      <View style={styles.headerContent}>
        <Text style={styles.appLogo}>TravelGo</Text>
        <View style={styles.separator}></View>
        <Text style={styles.disc}>{text}</Text>
      </View>
      {/* вот тут запилить логаут кнопку вместо иконки юзера  */}
      {!path.includes("userAccount") ? (
        <AccountButton />
      ) : (
        <LogoutButton setIsConfirmModalOpen={setIsConfirmModalOpen} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    position: "absolute",
    zIndex: 1,
    padding: 10,
  },

  headerContent: {
    width: "70%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  disc: {
    color: "black",
    fontSize: 25,
    zIndex: 2,
    fontFamily: "Text",
    includeFontPadding: false,
  },

  appLogo: {
    color: "black",
    fontSize: 25,
    zIndex: 2,
    fontFamily: "Merienda-Bold",
    includeFontPadding: false,
  },

  separator: {
    width: 2,
    height: "65%",
    backgroundColor: "black",
    marginHorizontal: 10,
    borderRadius: 5,
  },

  accountButtonConteiner: {
    width: "30%",
    height: "100%",
    backgroundColor: "black",
  },
});
