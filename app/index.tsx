
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1.2,
      duration: 3000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const navigateAfterDelay = async () => {
      await new Promise((res) => setTimeout(res, 2500));

      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        router.replace("/registration/step1");
        return;
      }
      
      try {
        const response = await fetch("http://192.168.1.100:5004/api/Auth/validate-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          router.replace("/(tabs)/main");
        } else {
          await AsyncStorage.removeItem("auth_token");
          router.replace("/registration/step1");
        }
        } catch (error) {
          console.error("Помилка при перевірці токена:", error);
          router.replace("/registration/step1");
        }
    };
    navigateAfterDelay();
  }, []);
  // useEffect(() => {
  //   const navigateAfterDelay = async () => {
  //     await new Promise((res) => setTimeout(res, 2500));
  //     router.replace("/registration/step1");
  //   };

  //   navigateAfterDelay();
  // }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/icons/sprout.png")}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />
      <Text style={styles.title}>GrowGuard</Text>
      <Text style={styles.slogan}>Контролюй. Аналізуй. Вирощуй.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 110, height: 110, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2E7D32" },
  slogan: { fontSize: 16, color: "#666", marginTop: 10 },
});
