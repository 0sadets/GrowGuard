// screens/GreenhouseDetailsScreen.tsx
import BackButton from "@/components/BackButton";
import DoubleDropdown from "@/components/Gh_details/norms";
import SensorDisplay from "@/components/Gh_details/real_data";
import GHGreatIndicator from "@/components/GhGreatIndicator";
import { useGreenhouseSignalR } from "@/hooks/useGreenhouseSignalR";
import {
  getGreenhouseById,
  getGreenhouseIdBySerialNumber,
  getGreenhouseStatus,
  getLastSensorData,
} from "@/lib/api";
import connection from "@/lib/SignalRProvider";
import type { SensorData, StatusWithAlerts } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
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
  const [status, setStatus] = useState<StatusWithAlerts>({
    status: "nodata",
    alerts: [],
  });

  const [visible, setVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "indicators" | "standards" | "controls"
  >("indicators");
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
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
          setStatus(statusResponse);
          console.log("Статус теплиці:", statusResponse.status);

          const lastData = await getLastSensorData(Number(id));
          console.log("📊 Останні дані з сенсорів:", lastData);
          const mappedData: SensorData = {
            airTemperature: lastData.airTemp,
            airHumidity: lastData.airHum,
            soilTemperature: lastData.soilTemp,
            soilHumidity: lastData.soilHum,
            light: lastData.lightLevel,
            greenhouseId: lastData.greenhouseId,
          };

          setSensorData(mappedData);
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
    console.log("121");
    if (!connection) return;

    return () => {
      isMounted = false;
    };
  }, [id, connection]);

  useGreenhouseSignalR(
    Number(id),
    (newStatus: StatusWithAlerts) => {
      const allowed = ["good", "warning", "error", "disconnected", "nodata"];
      if (allowed.includes(newStatus.status)) {
        console.log("SignalR оновлює статус:", newStatus);
        setStatus({ ...newStatus }); 
      }
    },
    (data) => {
      console.log("SignalR оновлює дані сенсорів:", data);
      setSensorData(data);
    }
  );

  if (loading) return <ActivityIndicator size="large" color="#4C6E45" />;
  if (!greenhouse) return <Text>Теплицю не знайдено.</Text>;
  console.log("статус 146 рядок: ", status.status);
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

      <GHGreatIndicator
        status={status.status ?? "nodata"}
        isConnected={isConnected}
      />

      <View style={styles.tabMenu}>
        <TouchableOpacity onPress={() => setActiveTab("indicators")}>
          <Text
            style={
              activeTab === "indicators" ? styles.activeTab : styles.inactiveTab
            }
          >
            Показники
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("standards")}>
          <Text
            style={
              activeTab === "standards" ? styles.activeTab : styles.inactiveTab
            }
          >
            Норми
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("controls")}>
          <Text
            style={
              activeTab === "controls" ? styles.activeTab : styles.inactiveTab
            }
          >
            Керування
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContent}>
        {activeTab === "indicators" && (
          <SensorDisplay
            greenhouseId={Number(id)}
            sensorData={sensorData}
            status={status}
          />
        )}
      </View>
      <View style={styles.tabContent}>
        {activeTab === "standards" && (
          <DoubleDropdown greenhouseId={Number(id)}/>
        )}
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
    paddingTop: 10,
  },
});
