import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Image } from "expo-image";

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

  // useEffect(() => {
  //   Image.prefetch([
  //     "@/src/assets/images/foodPic.jpg",
  //     "@/src/assets/images/afterDarkPic.jpg",
  //     "@/src/assets/images/artPic.jpg",
  //     "@/src/assets/images/hikingPic.png",
  //     "@/src/assets/images/historyPic.jpg"
  //   ])
  // }, []) доделать кеш через import { useAssets } from "expo-asset";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
