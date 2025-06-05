import { getGreenhouseById } from "@/lib/api";
import { AntDesign } from "@expo/vector-icons";
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
  console.log("id: ", id);
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
        {/* <BackButton style={styles.backButton} /> */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.push({
              pathname: "../greenhouse/gh_details",
              params: { id: Number(id) },
            })
          }
        >
          <AntDesign name="left" size={24} color="#C89F94" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Редагувати {greenhouse.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/greenhouse/update_gh_form?id=${id}`)}
        >
          <Text style={styles.buttonText}>Редагувати теплицю</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
           onPress={() => router.push(`/greenhouse/update_settings_form?id=${id}`)}
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
    paddingTop: 30,
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
    padding: 10,
    alignSelf: "flex-start",
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: "Nunito-Regular",
    color: "#423a3a",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15,
  },
  button: {
    backgroundColor: "#9BE68D", 
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
    backgroundColor: "#7FCC6F",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
});
