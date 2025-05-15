import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Slot } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Italic": require("@/assets/fonts/Nunito-Italic.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito-Bold.ttf"),
  });

  // const [isAuthChecked, setIsAuthChecked] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = await SecureStore.getItemAsync("accessToken");
  //     setIsAuthenticated(!!token);
  //     setIsAuthChecked(true);
  //   };

  //   checkAuth();
  // }, []);

 if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      {/* <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {isAuthenticated ? (
          <Stack.Screen name="greenhouse/main" />
        ) : (
          <Stack.Screen name="registration/step1" />
        )}
      </Stack> */}
      <Slot />
    </PaperProvider>
  );
}
