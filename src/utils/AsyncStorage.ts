import AsyncStorage from "@react-native-async-storage/async-storage";

const USERNAME = "user_name";
const ACCESS_TOKEN = "access_token";
// сохранения статуса входа в аккаунт

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

export const setUsername = async (name: string | null) => {
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
