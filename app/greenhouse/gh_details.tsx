// screens/GreenhouseDetailsScreen.tsx
import {
  getGreenhouseById,
  getGreenhouseIdBySerialNumber,
  getGreenhouseStatus,
} from "@/lib/api";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { useSignalR } from "@/lib/SignalRProvider";
import BackButton from "@/components/BackButton";
import GHGreatIndicator from "@/components/GhGreatIndicator";
import { useGreenhouseSignalR } from "@/hooks/useGreenhouseSignalR";
import connection from "@/lib/SignalRProvider";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Menu } from "react-native-paper";

interface Plant {
  id: number;
  category: string;
  optimalAirTempMin: number;
  optimalAirTempMax: number;
  optimalAirHumidityMin: number;
  optimalAirHumidityMax: number;
  optimalSoilHumidityMin: number;
  optimalSoilHumidityMax: number;
  optimalSoilTempMin: number;
  optimalSoilTempMax: number;
  optimalLightMin: number;
  optimalLightMax: number;
  optimalLightHourPerDay: number;
  exampleNames: string;
  features: string;
}

interface Greenhouse {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  season: string;
  location: string;
  plants: Plant[];
}
export default function GreenhouseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [greenhouse, setGreenhouse] = useState<Greenhouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<
    "good" | "warning" | "error" | "disconnected" | "nodata"
  >("nodata");
  const [visible, setVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<"indicators" | "standards" | "controls">("indicators");

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [fontsLoaded] = useFonts({
    "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Italic": require("../../assets/fonts/Nunito-Italic.ttf"),
  });

  useEffect(() => {
    let isMounted = true;

    const fetchGreenhouse = async () => {
      try {
        const data = await getGreenhouseById(Number(id));
        if (isMounted) {
          setGreenhouse(data);

          const statusResponse = await getGreenhouseStatus(Number(id));
          setStatus(statusResponse.status);
          console.log("📡 Статус теплиці:", statusResponse.status);
        }
        const deviceGreenhouseId = await getGreenhouseIdBySerialNumber(
          "ARDUINO-001"
        );
        if (Number(id) === deviceGreenhouseId) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error("❌ Помилка при завантаженні теплиці:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGreenhouse();

    if (!connection) return;

    return () => {
      isMounted = false;
    };
  }, [id, connection]);

  useGreenhouseSignalR(Number(id), (newStatus) => {
    const allowed = ["good", "warning", "error", "disconnected", "nodata"];
    if (allowed.includes(newStatus)) {
      setStatus(newStatus as any);
    }
  });

  if (loading) return <ActivityIndicator size="large" color="#4C6E45" />;
  if (!greenhouse) return <Text>Теплицю не знайдено.</Text>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.title}>{greenhouse.name}</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Ionicons name="ellipsis-vertical" size={24} color="#B48A75" />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => {}} title="Редагувати теплицю" />
            <Menu.Item onPress={() => {}} title="Переглянути інформацію" />
            <Menu.Item onPress={() => {}} title="Видалити теплицю" />
          </Menu>
        </View>
      </View>
      <GHGreatIndicator status={status} isConnected={isConnected} />
      <View style={styles.tabMenu}>
  <TouchableOpacity onPress={() => setActiveTab("indicators")}>
    <Text style={activeTab === "indicators" ? styles.activeTab : styles.inactiveTab}>Показники</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setActiveTab("standards")}>
    <Text style={activeTab === "standards" ? styles.activeTab : styles.inactiveTab}>Норми</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setActiveTab("controls")}>
    <Text style={activeTab === "controls" ? styles.activeTab : styles.inactiveTab}>Керування</Text>
  </TouchableOpacity>
</View>
{/* <View style={styles.tabContent}>
  {activeTab === "indicators" && <IndicatorsComponent greenhouseId={greenhouse.id} />}
  {activeTab === "standards" && <StandardsComponent plants={greenhouse.plants} />}
  {activeTab === "controls" && <ControlsComponent greenhouseId={greenhouse.id} />}
</View> */}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 5,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoImage: {
    width: 24,
    height: 24,
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontFamily: "Nunito-Regular",
    textAlign: "center",
    marginBottom: 10,
    color: "#423a3a",
    left: -10,
  },
  backButton: {
    left: -15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
   tabMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  activeTab: {
    fontWeight: "bold",
    color: "#4C6E45",
    borderBottomWidth: 2,
    borderBottomColor: "#4C6E45",
    paddingBottom: 5,
  },
  inactiveTab: {
    color: "#999",
    paddingBottom: 5,
  },
  tabContent: {
    padding: 10,
  },
});
