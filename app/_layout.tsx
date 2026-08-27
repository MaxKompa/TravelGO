import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Agbalumo-Regular": require("../src/assets/fonts/Agbalumo-Regular.ttf"),
    "Merienda-Bold": require("../src/assets/fonts/Merienda-Bold.ttf"),
    "Merienda-Regular": require("../src/assets/fonts/Merienda-Regular.ttf"),
    "PatrickHand-Regular": require("../src/assets/fonts/PatrickHand-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
