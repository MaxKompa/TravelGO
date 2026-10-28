import Background from "@/src/components/Background";
import ConfirmModal from "@/src/components/ConfirmModal";
import Header from "@/src/components/Header";
import RegistrationForm from "@/src/components/RegistrationForm";
import { useAuthState } from "@/src/store/useAuthState";
import { Colors } from "@/src/theme";
import { InfoForCreateAcc } from "@/src/types";
import {
  getAccessToken,
  getIsLogged,
  getUsername,
} from "@/src/utils/AsyncStorage";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import NoLogginedUserIcon from "../../src/assets/icons/noLogginedUserIcon.svg";

const AnimatedPressable = createAnimatedComponent(Pressable);

export default function userAccount() {
  const [accountCreatingFormInfo, setAccountCreatingFormInfo] =
    useState<InfoForCreateAcc>({
      username: "",
      password: "",
      email: "",
    });
  const path = usePathname();
  const username = useAuthState((state) => state.username);
  const [trips, setTrips] = useState([]);
  const [review, setReview] = useState([]);
  const [optionSelected, setOptionSelected] = useState<"trips" | "reviews">(
    "trips",
  );
  const isUserLogged = useAuthState((state) => state.isLogged); //changed on Zustand method
  const login = useAuthState((state) => state.login);
  const logout = useAuthState((state) => state.logout);

  //отрывающий стейт для модалки подтверждения выхода из аккаунта
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // проверка зарегестрирован ли юзер через asyncStorage
  useEffect(() => {
    if (path.includes("/userAccount")) {
      let result = false;
      const checkAuth = async () => {
        const asyncStorageResponse = await getIsLogged();

        //запись состояния залогиненного юзера в стор
        if (asyncStorageResponse === true) {
          const accessToken = await getAccessToken();
          const username = await getUsername();

          //тут в будущем сменить надписи на logout() что бы дать юзеру возможность залогиниться по новой и получить свой ключик на данное устройство
          login(
            accessToken ? accessToken : "User dont have an Access Token",
            username ? username : "Guest",
          );

          result = true;
        }

        if (result) {
          console.log("User logged in. Token and Username already exists.");
        }
      };

      checkAuth();
    }
  }, [path]);

  // animation ----------------------------------------------------------
  const animProgres = useSharedValue(0);

  const backgroundStyleRev = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animProgres.value,
      [0, 1],
      ["#fff", "#2e71df"],
    ),
  }));
  const textStyleRev = useAnimatedStyle(() => ({
    color: interpolateColor(animProgres.value, [0, 1], ["#000000", "#ffffff"]),
  }));

  const backgroundStyleTr = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animProgres.value,
      [0, 1],
      ["#2e71df", "#fff"],
    ),
  }));
  const textStyleTr = useAnimatedStyle(() => ({
    color: interpolateColor(animProgres.value, [0, 1], ["#fff", "#000000"]),
  }));

  // selector click handler
  const selectorPressHandler = (option: "trips" | "reviews") => {
    setOptionSelected(option);

    animProgres.value = withTiming(option == "trips" ? 0 : 1, {
      duration: 300,
    });
  };
  //---------------------------------------------

  return (
    <Background>
      {isUserLogged && (
        <>
          <Header
            text="Profile"
            setIsConfirmModalOpen={setIsConfirmModalOpen}
          />
          <View style={styles.contentWrapper}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBackground}>
                <NoLogginedUserIcon
                  width={80}
                  height={80}
                  color={"white"}
                ></NoLogginedUserIcon>
              </View>
              <View style={styles.usernameConteiner}>
                <Text style={styles.usernameText}>{username}</Text>
              </View>
            </View>
            <View style={styles.selector}>
              <AnimatedPressable
                style={[styles.selectorOption, backgroundStyleTr]}
                onPress={() => selectorPressHandler("trips")}
              >
                <Animated.Text style={[styles.optionText, textStyleTr]}>
                  Trips
                </Animated.Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={[styles.selectorOption, backgroundStyleRev]}
                onPress={() => selectorPressHandler("reviews")}
              >
                <Animated.Text style={[styles.optionText, textStyleRev]}>
                  Reviews
                </Animated.Text>
              </AnimatedPressable>
            </View>
          </View>
          <ConfirmModal
            isConfirmModalOpen={isConfirmModalOpen}
            setIsConfirmModalOpen={setIsConfirmModalOpen}
          />
        </>
      )}
      {!isUserLogged && (
        <RegistrationForm
          accountCreatingFormInfo={accountCreatingFormInfo}
          setAccountCreatingFormInfo={setAccountCreatingFormInfo}
        />
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.background,
  },
  avatarWrapper: {
    height: 350,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBackground: {
    backgroundColor: "#000000af",
    borderRadius: 100,
    padding: 20,
    marginTop: 70,
  },
  usernameConteiner: {
    alignSelf: "center",
    borderBottomWidth: 2,
    borderColor: Colors.secondary,
  },
  usernameText: {
    fontFamily: "Text",
    fontSize: 25,
    color: Colors.text,
    paddingVertical: 10,
  },
  selector: {
    width: "100%",
    height: 40,
    flexDirection: "row",
  },
  selectorOption: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: "white",
    borderTopWidth: 1,

    borderColor: Colors.background,
  },
  optionText: {
    textAlign: "center",
    fontFamily: "Text",
    fontSize: 20,
  },
});
