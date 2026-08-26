import { View, StyleSheet, Text, Pressable } from "react-native";
import { Colors } from "../theme";
import { ToolsListOptionProps } from "../types";
import UpArrow from "../assets/icons/upArrow.svg";


export default function ToolsListOption ({title} : ToolsListOptionProps)  {
    return(
        <View style = {styles.elementShadow}>
            <View style={styles.elementBackground}>
                <Text style = {styles.elementTitle}>{title}</Text>
                <Pressable style = {{ height:30, width:30, justifyContent:"center", alignItems:"center"}}>
                    <UpArrow style = {{height:20, width:20, zIndex:5, transform:[{rotate:"270deg"}]}}/>
                </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    elementBackground: {
        backgroundColor:Colors.background,
        borderWidth:1,
        borderColor: Colors.primary,
        borderRadius:17,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:20,
        flex:1,
    },

    elementShadow :{
        height:75,
        width:"100%",
        borderRadius:17,
        marginVertical:10,
        elevation:2,
    },

    elementTitle : {
        fontSize: 17
    }
})

