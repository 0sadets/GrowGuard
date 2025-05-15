// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.4,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setAnimationDone(true));
  }, []);

  useEffect(() => {
    const navigateAfterDelay = async () => {
      // Почекати ~2.5 секунди, поки анімація іде
      await new Promise((res) => setTimeout(res, 2500));

      const token = await AsyncStorage.getItem("auth_token"); // слідкуй за точним ключем
      if (token) {
        router.replace("/(tabs)/main");
      } else {
        router.replace("/registration/step1");
      }
    };

    navigateAfterDelay();
  }, []);

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
