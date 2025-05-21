import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getGreenhouseById } from "@/lib/api";
import GreenhouseStatusIndicator from "@/context/GreenhouseStatusContext";

export default function GreenhouseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [greenhouse, setGreenhouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getGreenhouseById(Number(id));
        setGreenhouse(data);
      } catch (err) {
        console.error("Помилка при завантаженні теплиці:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <Text>Завантаження...</Text>;
  }

  if (!greenhouse) {
    return <Text>Теплицю не знайдено</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <GreenhouseStatusIndicator greenhouseId={1} />

      <Text style={styles.title}>{greenhouse.name}</Text>
      <Text style={styles.subtitle}>ID: {greenhouse.id}</Text>
      <Text style={styles.section}>Рослини:</Text>
      {greenhouse.plants?.length > 0 ? (
        greenhouse.plants.map((plant: any) => (
          <Text key={plant.id} style={styles.plantItem}>
            {plant.name} — {plant.category}
          </Text>
        ))
      ) : (
        <Text style={styles.plantItem}>Немає доданих рослин</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    marginBottom: 10,
  },
  plantItem: {
    fontSize: 16,
    marginBottom: 8,
  },
});
