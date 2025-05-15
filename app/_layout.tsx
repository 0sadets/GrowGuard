import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Italic": require("@/assets/fonts/Nunito-Italic.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
