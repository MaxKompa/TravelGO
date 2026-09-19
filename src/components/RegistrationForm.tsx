import { useState } from "react";
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
import { getAccessToken, setAccessToken } from "../utils/AsyncStorage";
import LogInForm from "./LogInForm";

//схема валидции
const dataSchema = z.object({
  username: z.string().min(3, "Nickname must have at least 4 symbols."),
  email: z.email("Incorrect e-mail fromat."),
  password: z.string().min(6, "Password must have at least 6 symbols."),
});

export default function RegistrationForm({
  accountCreatingFormInfo,
  setAccountCreatingFormInfo,
}: RegistrationFormProps) {
  const [isLogInOpen, setIsLogInOpen] = useState(false);

  const sendRegisterData = async () => {
    try {
      const response = await fetch(
        "http://100.74.232.9:8000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(accountCreatingFormInfo),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            "Connect with server for registration was failed.",
        );
      }

      const allData = await response.json();
      const accessToken = allData.access_token;
      console.log(
        `Register server response: \n ${JSON.stringify(allData, null, 2)}`,
      );
      return accessToken;
    } catch (e: any) {
      console.error(`Registration request not complete. ${e}`);
      Alert.alert(
        "Registration failed.",
        e.message ||
          "Cannot connect to the server, check your internet connection.",
      );
    }
  };

  // обработчик нажатия \ валидация \ вывод ошибок \ обращение на сервер
  const createButtonPressHandler = async () => {
    console.log(
      `Данные перед валидацией: ${JSON.stringify(accountCreatingFormInfo, null, 2)}`,
    );
    const res = dataSchema.safeParse(accountCreatingFormInfo);
    if (!res.success) {
      const firstError = res.error.issues[0].message;
      Alert.alert("Invalid registration data!", `${firstError}`);
    } else {
      console.log(
        ` Данные прошли валидцию : ${JSON.stringify(accountCreatingFormInfo, null, 2)}`,
      );
      const tokenToSave = await sendRegisterData();
      if (tokenToSave) {
        await setAccessToken(tokenToSave);

        const loggedToken = await getAccessToken();

        console.log(
          `Token successfully saved to AsyncStorage! Token: ${loggedToken}}`,
        );
      }
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
          <Pressable onPress={() => setIsLogInOpen(true)}>
            <Text
              style={{
                fontSize: 14,
                color: Colors.primary,
                fontFamily: "Text",
                alignSelf: "center",
                marginBottom: 15,
                height: 30,
                width: 300,
                textAlign: "center",
              }}
            >
              Already have an account?
            </Text>
          </Pressable>

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
      {isLogInOpen && (
        <LogInForm
          onClose={() => setIsLogInOpen(false)}
          isLogInOpen={isLogInOpen}
        />
      )}
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    width: "100%",
    height: 40,
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
