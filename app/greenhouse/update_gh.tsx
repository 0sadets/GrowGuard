import BackButton from "@/components/BackButton";
import { getGreenhouseById } from "@/lib/api";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UpdateGHScreen() {
  const { id } = useLocalSearchParams();
  console.log("id: ", id)
  const [greenhouse, setGreenhouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
      "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
      "Nunito-Italic": require("../../assets/fonts/Nunito-Italic.ttf"),
      "Nunito-Regular": require("../../assets/fonts/Nunito-Regular.ttf"),
    });
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getGreenhouseById(Number(id));
        setGreenhouse(data);
      } catch (err: any) {
        setError(err.message || "Помилка");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
    );
  }

  if (error) {
    return <Text style={{ color: "red", marginTop: 20 }}>{error}</Text>;
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.pageTitle}>Редагувати {greenhouse.name}</Text>

      </View>
      <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={styles.button}
    // onPress={() => router.push(`/update_gh/edit/${id}`)}
  >
    <Text style={styles.buttonText}>Редагувати теплицю</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.button, styles.secondaryButton]}
    // onPress={() => router.push(`/update_gh/optimal/${id}`)}
  >
    <Text style={styles.buttonText}>Налаштувати клімат</Text>
  </TouchableOpacity>
</View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
    flexGrow: 1,
  },
  header: {
  position: "relative",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 20,
  marginBottom: 5,
},
backButton: {
  position: "absolute",
  left: -15,
},
pageTitle: {
  fontSize: 26,
  fontFamily: "Nunito-Regular",
  color: "#423a3a",
  textAlign: "center",
},
buttonContainer: {
  marginTop: 30,
  gap: 15,
},
button: {
  backgroundColor: "#9BE68D", // основний м'ятний
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 12,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
secondaryButton: {
  backgroundColor: "#7FCC6F", // темніший варіант основного кольору
},
buttonText: {
  color: "#ffffff",
  fontSize: 16,
  fontFamily: "Nunito-Bold",
},


  
});
