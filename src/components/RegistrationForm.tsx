import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import z from "zod";
import { Colors } from "../theme";
import { RegistrationFormProps } from "../types";

export default function RegistrationForm({
  accountCreatingFormInfo,
  setAccountCreatingFormInfo,
}: RegistrationFormProps) {
  //схема валидции
  const dataSchema = z.object({
    username: z.string().min(3, "Nickname must have at least 4 symbols."),
    email: z.email("Incorrect e-mail fromat."),
    password: z.string().min(6, "Password must have at least 6 symbols."),
  });

  // обработчик нажатия \ валидация \ вывод ошибок
  const createButtonPressHandler = () => {
    console.log(
      `Данные перед валидацией: ${JSON.stringify(accountCreatingFormInfo, null, 2)}`,
    );
    const res = dataSchema.safeParse(accountCreatingFormInfo);
    if (!res.success) {
      const error = z.prettifyError(res.error);
      const firstError = res.error.issues[0].message;
      console.error(`Данные не прошли валидацию: ${error}`);

      Alert.alert("Invalid registration data!", `${firstError}`);
    } else {
      console.log(
        ` Данные прошли валидцию : ${JSON.stringify(accountCreatingFormInfo, null, 2)}`,
      );
    }
  };
  return (
    <>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <View style={styles.noCreatedAccModal}>
          <View style={styles.modalTextWrapper}>
            <Text style={styles.label}>Creating Account</Text>
            <View style={styles.separator}></View>
            <Text style={[styles.text, { textAlign: "center" }]}>
              Hey! You don't have an account, we can fix this :)
            </Text>
          </View>
          <KeyboardAwareScrollView
            extraScrollHeight={40}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              <Text style={styles.inputLabel}>Type your nickname: </Text>
              <TextInput
                value={accountCreatingFormInfo.username}
                placeholder="John..."
                placeholderTextColor={Colors.text}
                style={styles.inputs}
                onChangeText={(text: string) =>
                  setAccountCreatingFormInfo((prev) => ({
                    ...prev,
                    username: text,
                  }))
                }
              ></TextInput>
              <Text style={styles.inputLabel}>And your e-mail: </Text>
              <TextInput
                value={accountCreatingFormInfo.email}
                placeholder="useremail@email.com"
                placeholderTextColor={Colors.text}
                style={styles.inputs}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(text: string) =>
                  setAccountCreatingFormInfo((prev) => ({
                    ...prev,
                    email: text,
                  }))
                }
              ></TextInput>
              <Text style={styles.inputLabel}>Write the strong password:</Text>
              <TextInput
                value={accountCreatingFormInfo.password}
                placeholder="veR4_diff1cult_p4ssw0rd"
                placeholderTextColor={Colors.text}
                style={styles.inputs}
                onChangeText={(text: string) =>
                  setAccountCreatingFormInfo((prev) => ({
                    ...prev,
                    password: text,
                  }))
                }
              ></TextInput>
            </View>
          </KeyboardAwareScrollView>
          <Pressable
            style={styles.createAccButton}
            onPress={createButtonPressHandler}
          >
            <Text style={[styles.text, { color: Colors.text2, fontSize: 20 }]}>
              Create
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  noCreatedAccModal: {
    width: "90%",
    height: "65%",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 20,
    padding: 20,
  },
  modalTextWrapper: {
    alignItems: "center",
  },
  label: {
    fontFamily: "LabelFont",
    fontSize: 25,
  },
  separator: {
    width: 100,
    height: 2,
    borderRadius: 20,
    backgroundColor: Colors.text2,
    margin: 15,
  },

  text: {
    fontFamily: "Text",
    fontSize: 16,
    color: Colors.text,
  },

  inputs: {
    color: "black",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    width: "100%",
    height: 50,
    padding: 5,
    textAlign: "center",
    fontSize: 16,
  },

  inputLabel: {
    fontSize: 18,
    fontFamily: "Text",
    color: Colors.text2,
    marginTop: 20,
    marginBottom: 10,
  },

  createAccButton: {
    height: 50,
    width: 170,
    borderRadius: 15,
    backgroundColor: Colors.button1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
