import { getLastDeviceState, updateDeviceState } from "@/lib/api";
import type { DeviceStateDto, DeviceUpdateRequest } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Controls() {
  const { id } = useLocalSearchParams();
  const [deviceState, setDeviceState] = useState<DeviceStateDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    setLoading(true);
    try {
      const data = await getLastDeviceState(Number(id));
      setDeviceState(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Помилка",
        text2: "Не вдалося завантажити стан пристрою.",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        bottomOffset: 50,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateState = async (update: DeviceUpdateRequest) => {
    try {
      await updateDeviceState(update);
      await fetchState();
      Toast.show({
        type: "success",
        text1: "Успіх",
        text2: "Стан пристрою оновлено.",
        position: "bottom",
        visibilityTime: 3000,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Помилка",
        text2: "Не вдалося оновити стан пристрою.",
        position: "bottom",
        visibilityTime: 3000,
      });
    }
  };

  const toggleFan = () => {
    if (!deviceState) return;
    handleUpdateState({
      ghId: deviceState.ghId,
      newState: !deviceState.fanStatus,
      deviceType: "fan",
    });
  };

  const toggleDoor = () => {
    if (!deviceState) return;
    handleUpdateState({
      ghId: deviceState.ghId,
      newState: !deviceState.doorStatus,
      deviceType: "door",
    });
  };

  useEffect(() => {
    fetchState();
  }, []);

  if (loading || !deviceState) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Керування пристроями</Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: deviceState.fanStatus ? "#7FCC6F" : "#9E9E9E" },
        ]}
        onPress={toggleFan}
      >
        <Text style={styles.buttonText}>
          {deviceState.fanStatus
            ? "Вимкнути вентилятор"
            : "Увімкнути вентилятор"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: deviceState.doorStatus ? "#7FCC6F" : "#9E9E9E" },
        ]}
        onPress={toggleDoor}
      >
        <Text style={styles.buttonText}>
          {deviceState.doorStatus ? "Закрити двері" : "Відкрити двері"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 15,
    borderColor: "#c9dbc8",
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    // fontWeight: "bold",
    fontFamily: "Nunito-bold",
    textAlign: "center",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
