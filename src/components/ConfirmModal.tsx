import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useAuthState } from "../store/useAuthState";
import { Colors } from "../theme";
import { ConfirmModalProps } from "../types";
import {
  setAccessToken,
  setIsLogged,
  setUsername,
} from "../utils/AsyncStorage";

export default function ConfirmModal({
  isConfirmModalOpen,
  setIsConfirmModalOpen,
}: ConfirmModalProps) {
  //переадрессация
  const router = useRouter();

  //logout из useAuthState
  const logout = useAuthState((state) => state.logout);

  // animation __________________________________________________
  const position = useSharedValue(-200);

  const animatedStyle = useAnimatedStyle(() => ({
    top: position.value,
  }));

  useEffect(() => {
    if (isConfirmModalOpen) {
      position.value = withSpring(250, {
        damping: 40,
        stiffness: 250,
      });
    } else {
      position.value = withSpring(-300, {
        damping: 50,
        stiffness: 400,
      });
    }
  }, [isConfirmModalOpen]);
  //____________________________________________________________

  //функция выхода из аккаунта, очищение локального хранилища а так же стейта useAuthState
  const handleLogout = () => {
    //useAuthState
    logout();

    //asyncStorage
    setIsLogged(false);
    setAccessToken(null);
    setUsername(null);
    router.replace("/home");
  };

  return (
    <Animated.View style={[styles.window, animatedStyle]}>
      <Text style={styles.label}>Log out?</Text>
      <View style={styles.separator}></View>
      <Text style={styles.text}>
        Are you sure you want to sign out of your account?
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button]}>
          <Text
            style={[styles.text, { color: "black", fontSize: 20 }]}
            onPress={() => handleLogout()}
          >
            Yes
          </Text>
        </Pressable>
        <Pressable
          style={[styles.button]}
          onPress={() => setIsConfirmModalOpen(false)}
        >
          <Text style={[styles.text, { color: "black", fontSize: 20 }]}>
            No
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  window: {
    position: "absolute",
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignSelf: "center",
    zIndex: 20,
    padding: 10,
  },
  label: {
    fontSize: 25,
    fontFamily: "LabelFont",
    alignSelf: "center",
    color: Colors.primary2,
  },

  separator: {
    width: 150,
    height: 1,
    backgroundColor: "#0000003a",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 5,
  },
  text: {
    fontSize: 18,
    fontFamily: "Text",
    color: Colors.text,
    textAlign: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    marginTop: 30,
    paddingVertical: 5,
  },

  button: {
    width: "50%",
    height: 30,
  },
});
