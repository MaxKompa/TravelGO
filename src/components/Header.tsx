import { StyleSheet, Text, View, Pressable } from "react-native";
import { HeaderProps } from "../../src/types";
import { Colors } from "../theme";
import { usePathname } from "expo-router";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackArrowIcon from "../assets/icons/BackArrowIcon.svg";
import { useRouter } from "expo-router"; 
import { LinearGradient } from "expo-linear-gradient";

export default function Header({ text }: HeaderProps) {
  
  
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const router = useRouter()
  const handlePress = () => {
    router.replace('/home')
  }

  useEffect(()=>{
    console.log("path had changed!")
  },[path])

  return (
    <View style={styles.headerWrapper}>

      {/* кнопка назад в случае если пользователь не на нглавной станице */}
      { path.includes("/home") ? null 
      : 
      <Pressable 
      style = {[styles.backButtonShadow, {top: insets.top}]}
      onPress = {() => handlePress()}
      >
        <LinearGradient 
        start={{ x : 0.9, y:  0 }}
        end={{ x : 0.2, y : 1 }}
        colors={["#2c6bcf", "#86a7df"]}
        style={styles.backButton}>
          <BackArrowIcon height={25} width={25}/>
        </LinearGradient>
      </Pressable> }

      <View style={[styles.headerContent, {padding:10, paddingTop: insets.top}]}>
        <Text style={styles.label}>{text}</Text>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
    elevation: 3,
    position: "absolute",
    zIndex: 1,
    borderBottomColor: Colors.primaryBlured,
    borderBottomWidth: 1,
    justifyContent:"center"
  },

  headerContent: {
    backgroundColor: Colors.primary,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "white",
    fontSize: 25,
    zIndex: 2,
    fontFamily: "Merienda-Bold",
    includeFontPadding:false,
    
  },

  backButtonShadow: {
    height:50,
    width:50,
    position:"absolute",
    zIndex:1,
    marginLeft:10,
    elevation:5,
  },

  backButton : {
    width:50,
    height:40,
    borderRadius:20, 
    backgroundColor:"#5e8fde", 
    justifyContent:"center",
    alignItems:"center",
    overflow:"hidden", 
    borderWidth:1,
    borderColor:Colors.background,
  }
});
