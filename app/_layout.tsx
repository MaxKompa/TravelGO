import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

// Массив тяжелых изображений для предзагрузки
const carouselImages = [
  require("../src/assets/images/carousel-images/carousel-image1.jpg"),
  require("../src/assets/images/carousel-images/carousel-image2.jpg"),
  require("../src/assets/images/carousel-images/carousel-image3.jpg"),
  require("../src/assets/images/carousel-images/carousel-image4.jpg"),
  require("../src/assets/images/carousel-images/carousel-image5.jpg"),
  require("../src/assets/images/carousel-images/carousel-image6.jpg"),
  require("../src/assets/images/carousel-images/carousel-image7.jpg"),
  require("../src/assets/images/afterDarkPic.jpg"),
  require("../src/assets/images/artPic.jpg"),
  require("../src/assets/images/foodPic.jpg"),
  require("../src/assets/images/hikingPic.png"),
  require("../src/assets/images/historyPic.jpg"),
];

export default function RootLayout() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Agbalumo-Regular": require("../src/assets/fonts/Agbalumo-Regular.ttf"),
    "Merienda-Bold": require("../src/assets/fonts/Merienda-Bold.ttf"),
    "Merienda-Regular": require("../src/assets/fonts/Merienda-Regular.ttf"),
    "PatrickHand-Regular": require("../src/assets/fonts/PatrickHand-Regular.ttf"),
    LabelFont: require("../src/assets/fonts/BebasNeue-Regular.ttf"),
    Text: require("../src/assets/fonts/Outfit-Regular.ttf"),
  });

  useEffect(() => {
    async function loadResources() {
      try {
        await Asset.loadAsync(carouselImages);
      } catch (e) {
        console.warn("Ошибка предзагрузки изображений:", e);
      } finally {
        setImagesLoaded(true);
      }
    }

    loadResources();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && imagesLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, imagesLoaded]);

  if ((!fontsLoaded && !fontError) || !imagesLoaded) {
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
