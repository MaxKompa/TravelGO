import AsyncStorage from "@react-native-async-storage/async-storage";

const IS_USER_LOGGED_IN_KEY = "is_user_logged_in";
const USERNAME = "user_name";
const ACCESS_TOKEN = "access_token";
// сохранения статуса входа в аккаунт
export const setIsLogged = async (value: boolean) => {
  try {
    await AsyncStorage.setItem(IS_USER_LOGGED_IN_KEY, JSON.stringify(value));
  } catch (e) {
    console.error(`IS LOGGED SET STATUS ERROR: ${e}`);
  }
};

//проверка статуса входа в аккаунт
export const getIsLogged = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(IS_USER_LOGGED_IN_KEY);
    return value ? JSON.parse(value) : false;
  } catch (e) {
    console.error(`IS LOGGED GET STATUS ERROR ${e}`);
    return false;
  }
};

// сохранение токен-идентификатора для бекенда
export const setAccessToken = async (value: string | null) => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify(value));
  } catch (e) {
    console.error(`SET ACCESS TOKEN ERROR : ${e}`);
  }
};

//експорт токена для состояний на клиенте
export const getAccessToken = async (): Promise<string | false> => {
  try {
    const value = await AsyncStorage.getItem(ACCESS_TOKEN);
    return value ? JSON.parse(value) : false;
  } catch (e) {
    console.error(`GET ACCESS TOKEN ERROR`);
    return false;
  }
};

export const setUsername = async (name: string) => {
  try {
    await AsyncStorage.setItem(USERNAME, JSON.stringify(name));
  } catch (e) {
    console.error(`SET USERNAME ERROR: ${e}`);
  }
};

export const getUsername = async () => {
  try {
    const value = await AsyncStorage.getItem(USERNAME);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error(`GET USERNAME ERROR: ${e}`);
  }
};
