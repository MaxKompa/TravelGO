import { Tabs, usePathname } from "expo-router";

export default function RootLayout() {
  const pathName = usePathname();
  console.log(pathName);

  // эффект на случай если нужно проверить на какой вкладке находиться пользователь
  // useEffect(() => {
  //   alert(pathName);
  // }, [pathName]);

  const isHomeGroupScreens =
    pathName.includes("home") ||
    pathName.includes("locations") ||
    pathName.includes("themes");

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="map" options={{ title: "Map" }} />

      <Tabs.Screen
        name="themes"
        options={{
          title: "Themes",
          tabBarButton: isHomeGroupScreens ? undefined : () => null,
        }}
      />
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          tabBarButton: isHomeGroupScreens ? undefined : () => null,
        }}
      />
      <Tabs.Screen name="tools" options={{ title: "Tools" }} />
    </Tabs>
  );
}
