import Header from "@/src/components/Header";
import Background from "@/src/components/Background";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/src/theme";
import ToolsListOption from "@/src/components/ToolsListOption";



export default function ToolsMenu() {
  return (
    <Background>
      <Header text="Tools"/> 
      <View style ={styles.toolsListContainer}>
        <ToolsListOption title = "Trip Cost"/>
        <ToolsListOption title = "Translator"/>
        <ToolsListOption title = "Local laws"/>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
    toolsListContainer :{
      marginVertical: 120,
      flex:1,
      width:"90%",
      alignSelf:"center",
      backgroundColor:"transparent",
      borderRadius:20,
      borderWidth:1,
      borderColor: Colors.primaryBlured,
      alignItems:"center",
      padding:20,
      flexDirection:"column"
    
    }
})