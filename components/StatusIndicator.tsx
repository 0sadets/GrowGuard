// components/StatusIndicator.tsx
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import { Status, getStatusColor } from "@/assets/utils/statusColor";
export type Status = "good" | "warning" | "error" | "loading";

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case "good":
      return "#9be68d";
    case "warning":
      return "#f3d498";
    case "error":
      return "#f29d9d";
    default:
      return "gray";
  }
};

export const GreenhouseStatusIndicator = ({
  status,
}: {
  status: Status;
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: getStatusColor(status) }]} />
      <Text style={styles.text}>Статус: {status}</Text>
      {status === "loading" && <ActivityIndicator size="small" color="#999" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
  },
});
