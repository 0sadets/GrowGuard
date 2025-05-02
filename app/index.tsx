import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

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
    ]).start();
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        setTimeout(() => {
          if (token) {
            navigation.replace("Home");
          } else {
            navigation.replace("registration/step1");
          }
        }, 2500);
      } catch (error) {
        console.error("Login check failed", error);
        navigation.replace("registration/step1");
      }
    };

    checkLoginStatus();
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
