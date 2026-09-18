import AsyncStorage from "@react-native-async-storage/async-storage";

const IS_USER_LOGGED_IN_KEY = "is_user_logged_in";

export const setIsLogged = async (value: boolean) => {
  try {
    await AsyncStorage.setItem(IS_USER_LOGGED_IN_KEY, JSON.stringify(value));
  } catch (e) {
    console.error(`IS LOGGED SET STATUS ERROR: ${e}`);
  }
};

export const getIsLogged = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(IS_USER_LOGGED_IN_KEY);
    return value ? JSON.parse(value) : false;
  } catch (e) {
    console.error(`IS LOGGED GET STATUS ERROR ${e}`);
    return false;
  }
};
