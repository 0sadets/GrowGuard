import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

const API_BASE_URL = "http://192.168.1.101:5004/api"; // заміни на свій

type StatusType = "good" | "warning" | "error" | "noData";

interface Props {
  greenhouseId: number;
}

const getGreenhouseStatus = async (greenhouseId: number) => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) throw new Error("Користувач не авторизований.");

    const response = await axios.post(
      `${API_BASE_URL}/Greenhouse/status`,
      greenhouseId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Помилка при отриманні статусу теплиці:",
      error.response?.data || error.message
    );
    return null;
  }
};

const GreenhouseStatusIndicator: React.FC<Props> = ({ greenhouseId }) => {
  const [status, setStatus] = useState<StatusType>("noData");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      const data = await getGreenhouseStatus(greenhouseId);
      if (!data) {
        setStatus("noData");
      } else if (data.status === "error") {
        setStatus("error");
      } else if (data.status === "warning") {
        setStatus("warning");
      } else if (data.status === "good") {
        setStatus("good");
      } else {
        setStatus("noData");
      }
      setLoading(false);
    };

    fetchStatus();
  }, [greenhouseId]);

  const getStatusStyle = () => {
    switch (status) {
      case "good":
        return { color: "#2e7d32", bgColor: "#a5d6a7", icon: "check" };
      case "warning":
        return { color: "#f9a825", bgColor: "#ffe082", icon: "exclamation" };
      case "error":
        return { color: "#c62828", bgColor: "#ef9a9a", icon: "times" };
      case "noData":
      default:
        return { color: "#757575", bgColor: "#e0e0e0", icon: "question" };
    }
  };

  const { color, bgColor, icon } = getStatusStyle();

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={[styles.circle, { backgroundColor: bgColor }]}>
      <FontAwesome name="check" size={40} color={color} />
      <Text style={styles.label}>
        {status === "good"
          ? "В нормі"
          : status === "warning"
          ? "Попередження"
          : status === "error"
          ? "Критичний стан"
          : "Немає даних"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
});

export default GreenhouseStatusIndicator;
