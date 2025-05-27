import type { SensorData, StatusWithAlerts } from "@/types/types";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFonts } from "expo-font";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
const SensorDisplay = ({
  greenhouseId,
  sensorData,
  status,
}: {
  greenhouseId: number;
  sensorData: SensorData | null;
  status: StatusWithAlerts;
}) => {
  const [fontsLoaded] = useFonts({
    "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Italic": require("../../assets/fonts/Nunito-Italic.ttf"),
    "Nunito-Regular": require("../../assets/fonts/Nunito-Regular.ttf"),
  });
  const renderStatusText = () => {
    switch (status.status) {
      case "good":
        return "В нормі";
      case "warning":
        return "Щось не так";
      case "error":
        return "Критична помилка";
      case "disconnected":
        return "Відключено";
      case "nodata":
        return "Немає даних";
      default:
        return "Невідомо";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <View style={styles.dataBox}>
          <Text style={styles.dataBoxText}>Грунт</Text>
          <View style={styles.dataValues}>
            <View style={styles.dataValuesPart}>
              <FontAwesome6 name="temperature-half" size={24} color="#6B7280" />
              <Text style={styles.iconText}>Температура</Text>
              {sensorData ? (
                <Text style={styles.sensorDataText}>
                  {sensorData.soilTemperature} °C
                </Text>
              ) : (
                <Text>?</Text>
              )}
            </View>
            <View style={styles.dataValuesPart}>
              <FontAwesome6 name="droplet" size={24} color="#6B7280" />
              <Text style={styles.iconText}>Вологість</Text>
              {sensorData ? (
                <Text style={styles.sensorDataText}>
                  {sensorData.soilHumidity} %
                </Text>
              ) : (
                <Text>?</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.dataLightBox}>
          <Text style={styles.dataBoxText}>Світло</Text>
          <View style={styles.dataValues}>
            <View style={{ alignItems: "center" }}>
              <Feather name="sun" size={24} color="#6B7280" />
              <Text style={styles.iconText}>Освітлення</Text>
              {sensorData ? (
                <Text style={styles.sensorDataText}>
                  {sensorData.light} люкс
                </Text>
              ) : (
                <Text>?</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.dataBox}>
          <Text style={styles.dataBoxText}>Повітря</Text>
          <View style={styles.dataValues}>
            <View style={styles.dataValuesPart}>
              <FontAwesome6 name="temperature-half" size={24} color="#6B7280" />
              <Text style={styles.iconText}>Температура</Text>
              {sensorData ? (
                <Text style={styles.sensorDataText}>
                  {sensorData.airTemperature} °C
                </Text>
              ) : (
                <Text>?</Text>
              )}
            </View>
            <View style={styles.dataValuesPart}>
              <FontAwesome6 name="droplet" size={24} color="#6B7280" />
              <Text style={styles.iconText}>Вологість</Text>
              {sensorData ? (
                <Text style={styles.sensorDataText}>
                  {sensorData.airHumidity} %
                </Text>
              ) : (
                <Text>?</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.noteBox}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 16,
                color: "#666666",
              }}
            >
              Загальне
            </Text>
            <FontAwesome6 name="info" size={22} color="#6B7280" />
          </View>
          <Text style={{ fontFamily: "Nunito-Regular", color: "#666666", marginTop:5 }}>
            Стан теплиці:{" "}
            <Text style={{ fontFamily: "Nunito-Bold" }}>
              {renderStatusText()}
            </Text>
          </Text>
          {status.alerts && status.alerts.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  marginBottom: 4,
                  fontFamily: "Nunito-Bold",
                  color: "#4D4D4D",
                }}
              >
                Попередження:
              </Text>
              {status.alerts.map((alert, index) => (
                <Text
                  key={index}
                  style={{ color: "#c96a6a", fontFamily: "Nunito-Regular" }}
                >
                  • {alert}
                </Text>
              ))}
            </View>
          )}
          <Text
            style={{
              fontFamily: "Nunito-Italic",
              color: "#666666",
              marginTop: 15,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Дотримуйтесь загальних норм та рекомендацій
          </Text>
        </ScrollView>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    margin: 0,
  },
  dataContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dataLightBox: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#666666",
    borderRadius: 5,
    width: "25%",
    paddingBottom: 5,
    backgroundColor: "#FFFFFF",
  },

  dataBox: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#666666",
    borderRadius: 5,
    width: "35%",
    paddingBottom: 5,
    backgroundColor: "#FFFFFF",
  },
  dataBoxText: {
    fontFamily: "Nunito-Regular",
    textAlign: "center",
    fontSize: 16,
    color: "#808080",
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
    marginBottom: 2,
  },
  dataValues: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  dataValuesPart: {
    flexDirection: "column",
    alignItems: "center",
    width: "50%",
  },
  iconText: {
    fontFamily: "Nunito-Regular",
    fontSize: 6,
    marginBottom: 5,
    alignItems: "center",
  },
  sensorDataText: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
  },
  noteBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    maxHeight: 200,
    overflow: "hidden",
  },
});

export default SensorDisplay;
