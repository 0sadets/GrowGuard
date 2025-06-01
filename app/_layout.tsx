// import { SignalRProvider } from "@/lib/SignalRProvider";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("@/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Italic": require("@/assets/fonts/Nunito-Italic.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito-Bold.ttf"),
    "Nunito-BoldItalic": require("@/assets/fonts/Nunito-BoldItalic.ttf"),
    "Nunito-SemiBoldItalic": require("@/assets/fonts/Nunito-SemiBoldItalic.ttf"),
    "Nunito-SemiBold": require("@/assets/fonts/Nunito-SemiBold.ttf"),
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
      {/* <SignalRProvider> */}
      <Slot />
      {/* </SignalRProvider> */}
    </PaperProvider>
  );
}
