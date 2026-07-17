import Background from "@/src/components/Background";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "../../src/components/Header";
import { Colors } from "../../src/theme";

export default function HomeScreen() {
  return (
    <Background>
      <Header text={"TravelGo"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContainer}>
          <View style={styles.formWrapper}>
            <Text style={styles.formText}>Select Country:</Text>
            <TextInput
              style={styles.inputs}
              placeholder="np.Poland"
            ></TextInput>
            <Text style={styles.formText}>Select City:</Text>
            <TextInput
              style={styles.inputs}
              placeholder="np.Katowice"
            ></TextInput>
            <View style={styles.bottomWrapper}>
              <View style={styles.asideWrapper}>
                <Text style={[styles.formText, { fontSize: 25 }]}>
                  Start time:
                </Text>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.inputs, { width: 150 }]}
                  placeholder="dd.mm.rrrr"
                ></TextInput>
              </View>
              <View style={styles.separator}></View>
              <View style={styles.asideWrapper}>
                <Text style={[styles.formText, { fontSize: 25 }]}>
                  End time:
                </Text>

                {/* добавить библиотеку которая добавляет выбор даты */}
                <TextInput
                  keyboardType="numeric"
                  style={[styles.inputs, { width: 150 }]}
                  placeholder="dd.mm.rrrr"
                ></TextInput>
              </View>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={{ fontFamily: "PatrickHand-Regular", fontSize: 21 }}>
                Choose Themes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Background>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.background,
    flex: 1,
  },

  formContainer: {
    width: "100%",
    height: "87%",
    backgroundColor: Colors.primary2,
    borderRadius: 34,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
  },

  formWrapper: {
    width: "100%",
    height: "70%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 120,
  },

  formText: {
    color: "white",
    fontSize: 33,
    fontFamily: "PatrickHand-Regular",
  },

  inputs: {
    width: 300,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 10,
    margin: 30,
    marginBottom: 50,
  },

  separator: {
    width: 2,
    borderRadius: 30,
    height: 100,
    margin: 5,
    backgroundColor: "white",
    marginTop: 30,
  },

  bottomWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "30%",
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  asideWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "45%",
    height: "100%",
    alignItems: "center",
  },

  button: {
    width: 200,
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors.button2,
    color: "black",
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    padding: 5,
    marginTop: 30,
    justifyContent: "center",
  },
});
