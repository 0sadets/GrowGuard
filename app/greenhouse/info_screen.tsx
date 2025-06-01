
import {
  getGreenhouseById,
  getGreenhouseStatus,
  getuserSettingsByGHId,
} from "@/lib/api";
import type { Greenhouse, StatusWithAlerts, UserSettings } from "@/types/types";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

export default function GreenhouseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [greenhouse, setGreenhouse] = useState<Greenhouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings[] | null>(null);

  const [status, setStatus] = useState<StatusWithAlerts>({
    status: "nodata",
    alerts: [],
  });

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  //   const [fontsLoaded] = useFonts({
  //     "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
  //     "Nunito-Italic": require("../../assets/fonts/Nunito-Italic.ttf"),
  //   });

  useEffect(() => {
    let isMounted = true;

    const fetchGreenhouse = async () => {
      try {
        const data = await getGreenhouseById(Number(id));
        if (isMounted) {
          setGreenhouse(data);

          const statusResponse = await getGreenhouseStatus(Number(id));
          setStatus(statusResponse);
          //   console.log("Статус теплиці:", statusResponse.status);
          const userSettingsResponse = await getuserSettingsByGHId(Number(id));
          setUserSettings(userSettingsResponse);
        }
      } catch (error) {
        console.log(" Помилка при завантаженні теплиці:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGreenhouse();

    return () => {
      isMounted = false;
    };
  }, [id]);
  const seasonTranslations: Record<string, string> = {
    summer: "Літо",
    autumn: "Осінь",
    spring: "Весна",
    winter: "Зима",
    undefined: "Не визначений",
  };

  const renderSeasonText = () => {
    return seasonTranslations[greenhouse?.season ?? ""] || "Невідомо";
  };

  if (loading) return <ActivityIndicator size="large" color="#4C6E45" />;
  if (!greenhouse) return <Text>Теплицю не знайдено.</Text>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* шапка */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.sideButton, { left: -15 }]}
          onPress={() =>
            router.push({
              pathname: "../greenhouse/gh_details",
              params: { id: Number(id) },
            })
          }
        >
          <AntDesign name="left" size={24} color="#C89F94" />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Інформація</Text>
        </View>

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
              <TouchableOpacity
                style={[styles.sideButton, { right: -15 }]}
                onPress={openMenu}
              >
                <AntDesign name="setting" size={26} color="#B48A75" />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() =>
                router.push({
                  pathname: "./update_gh",
                  params: { id: greenhouse.id },
                })
              }
              title="Редагувати теплицю"
            />
          </Menu>
        </View>
      </View>
      {/* дані */}
      {greenhouse && (
        <>
          <View style={styles.shadowWrapper}>
            <View style={styles.block}>
              <Text style={[styles.Label, { fontSize: 22, color: "#4B8B3B" }]}>
                🌱 Моя теплиця: {greenhouse.name}
              </Text>

              <Text style={styles.dataText}>
                Розміри: {greenhouse.length} x {greenhouse.width} x{" "}
                {greenhouse.height}(м)
              </Text>
              <Text style={styles.dataText}>
                Сезон посадки: {renderSeasonText()}
              </Text>
              <Text style={styles.dataText}>
                Розташування: {greenhouse.location}
              </Text>
            </View>
          </View>
          <View style={styles.shadowWrapper}>
            <View style={styles.block}>
              <Text style={[{ marginTop: 10 }, styles.Label]}>Рослини:</Text>
              {greenhouse.plants.map((plant, index) => (
                <View
                  key={plant.id}
                  style={{
                    marginBottom: 10,
                    padding: 10,
                    backgroundColor: "#f3fceb",
                    borderRadius: 8,
                  }}
                >
                  <Text style={styles.lilLabel}>
                    {index + 1}. {plant.category}
                  </Text>
                  <Text style={styles.dataText}>
                    Приклади: {plant.exampleNames}
                  </Text>
                  <Text style={styles.featuresText}>{plant.features}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {status && (
        <View style={styles.shadowWrapper}>
          <View style={styles.block}>
            <Text style={styles.Label}>Статус теплиці: {status.status}</Text>
            {status.alerts.length > 0 && (
              <>
                <Text style={styles.lilLabel}>Попередження:</Text>
                {status.alerts.map((alert, index) => (
                  <Text key={index} style={{ color: "#c96a6a" }}>
                    • {alert}
                  </Text>
                ))}
              </>
            )}
          </View>
        </View>
      )}

      {userSettings && (
        <View style={styles.shadowWrapper}>
          <View style={styles.block}>
            <Text style={styles.Label}>Налаштування користувача</Text>
            <Text style={styles.dataText}>
              Температура повітря: {userSettings[0].airTempMin}°C –{" "}
              {userSettings[0].airTempMax}°C
            </Text>
            <Text style={styles.dataText}>
              Вологість повітря: {userSettings[0].airHumidityMin}% –{" "}
              {userSettings[0].airHumidityMax}%
            </Text>
            <Text style={styles.dataText}>
              Температура ґрунту: {userSettings[0].soilTempMin}°C –{" "}
              {userSettings[0].soilTempMax}°C
            </Text>
            <Text style={styles.dataText}>
              Вологість ґрунту: {userSettings[0].soilHumidityMin}% –{" "}
              {userSettings[0].soilHumidityMax}%
            </Text>
            <Text style={styles.dataText}>
              Освітленість: {userSettings[0].lightMin} –{" "}
              {userSettings[0].lightMax} люкс
            </Text>
          </View>
        </View>
      )}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  logoImage: {
    width: 24,
    height: 24,
    marginTop: 4,
    right: 2,
  },
  title: {
    fontSize: 26,
    fontFamily: "Nunito-Regular",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 10,
    color: "#2D2D2D",
    left: 10,
  },
  sideButton: {
    width: 40,
    alignItems: "center",
  },
  Label: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: "#4B8B3B",
    marginBottom: 10,
    textAlign: "center",
  },
  dataText: {
    fontFamily: "Nunito-Regular",
    fontSize: 15,
    color: "#4F4F4F",
  },
  lilLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#A46B4F",
  },
  featuresText: {
    fontFamily: "Nunito-Italic",
    fontSize: 16,
    color: "#3D9A43",
    fontWeight: "600",
  },
  shadowWrapper: {
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  block: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
  },

});
