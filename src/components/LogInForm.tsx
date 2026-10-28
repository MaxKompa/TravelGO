import { BlurView } from "expo-blur";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ClearButtonIcon from "../assets/icons/ClearButtonIcon.svg";
import { Colors } from "../theme";

import { useEffect, useState } from "react";
import { useAuthState } from "../store/useAuthState";
import { LogInFormProps } from "../types";
import {
  setAccessToken,
  setIsLogged,
  setUsername,
} from "../utils/AsyncStorage";

export default function LogInForm({ onClose, isLogInOpen }: LogInFormProps) {
  //логин из стейта Zustand (UseAuthState)
  const login = useAuthState((state) => state.login);

  //данные введенные в форму логина
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  //animation ________________________________________________________________
  const opacity = useSharedValue(0);
  const blurStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 400 }),
  }));

  const transformY = useSharedValue(600);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: transformY.value }],
  }));

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 50 });
    transformY.value = withTiming(0, { duration: 400 });
  }, [isLogInOpen]);

  const handleClosePress = () => {
    opacity.value = withTiming(0, { duration: 70 });
    transformY.value = withTiming(-800, { duration: 300 });
    setTimeout(() => {
      onClose();
    }, 500);
  };
  //________________________________________________________________
  // отправка данных для проверки существует ли юзер
  const sendLoginData = async () => {
    try {
      const response = await fetch("http://100.74.232.9:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login cannot be complete.");
      }

      const data = await response.json();
      console.log(
        `Server response on Login : ${JSON.stringify(data, null, 2)}`,
      );

      return data;
    } catch (e: any) {
      console.log(`Login cannot be complete. ${e}`);

      Alert.alert(
        "Autorization failed.",
        e.message ||
          "Cannot connect to the server, check your internet connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // вызов функции отправки при нажатии, запись данных в AcyncStorage и в Стор useAuthState
  const handleLoginPress = async () => {
    setIsLoading(true);
    const userEntryData = await sendLoginData();
    if (userEntryData) {
      //useAuthState
      login(userEntryData.access_token, userEntryData.username);

      //AsyncStorage
      await setIsLogged(true);
      await setAccessToken(userEntryData.access_token);
      await setUsername(userEntryData.username);

      //Логи подтверждения сохранения
      console.log(
        `Access Token in AsyncStorage: ${userEntryData.access_token}`,
      );
      console.log(
        `Autorization of user ${userEntryData.username} finished successfully`,
      );
    }
  };
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          position: "absolute",
        },
        blurStyle,
      ]}
    >
      <BlurView
        intensity={90}
        tint="dark"
        style={[StyleSheet.absoluteFillObject, { justifyContent: "center" }]}
      >
        <Animated.View style={[styles.logInCard, cardStyle]}>
          <KeyboardAwareScrollView
            extraHeight={40}
            enableOnAndroid={true}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.label}> Sign In </Text>
              <Pressable onPress={() => handleClosePress()}>
                <ClearButtonIcon width={20} height={20} color={Colors.text} />
              </Pressable>
            </View>
            <View style={styles.separator}></View>

            <View style={styles.formWrapper}>
              <Text style={[styles.inputText, { marginTop: 10 }]}>E-mail:</Text>
              <TextInput
                value={loginData.email}
                style={styles.inputs}
                placeholder="Type your e-mail..."
                placeholderTextColor={Colors.text}
                onChangeText={(text: string) =>
                  setLoginData((prev) => ({
                    ...prev,
                    email: text,
                  }))
                }
              />
              <Text style={styles.inputText}>Password:</Text>
              <TextInput
                style={styles.inputs}
                value={loginData.password}
                placeholder="Type your password..."
                placeholderTextColor={Colors.text}
                onChangeText={(text: string) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: text,
                  }))
                }
              />
              <Pressable
                style={styles.button}
                onPress={() => handleLoginPress()}
              >
                {isLoading ? (
                  <ActivityIndicator color={"white"} size={"small"} />
                ) : (
                  <Text style={{ fontFamily: "Text", fontSize: 20 }}>
                    Sign In
                  </Text>
                )}
              </Pressable>
            </View>
          </KeyboardAwareScrollView>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logInCard: {
    alignSelf: "center",
    height: 400,
    width: "75%",
    backgroundColor: "white",
    borderRadius: 15,
  },
  formWrapper: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  label: {
    fontSize: 28,
    fontFamily: "LabelFont",
    color: "black",
  },
  inputText: {
    fontSize: 17,
    fontFamily: "Text",
  },
  inputs: {
    width: "100%",
    height: 45,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginVertical: 10,
    padding: 10,
    fontSize: 13,
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.button1,
    height: 50,
    width: 200,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 15,
  },
  separator: {
    width: "100%",
    height: 2,
    borderRadius: 20,
    backgroundColor: Colors.text2,
    alignSelf: "center",
  },
});
