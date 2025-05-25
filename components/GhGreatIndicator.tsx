import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

type Status = "good" | "warning" | "error" | "disconnected" | "nodata";

interface Props {
  status: Status;
  isConnected: boolean;
}
const statusConfig = {
  good: {
    color: "#9be68d", // зелений
    icon: <MaterialIcons name="check" size={80} color="white" />,
    text: "Все добре",
    borderCol:"#5aab53"
  },
  warning: {
    color: "#f3d498", // оранжевий
    icon: <Entypo name="warning" size={40} color="white" />,
    text: "Щось не так...",
    borderCol:"#c29f53"
  },
  error: {
    color: "#f29d9d", // червоний
    icon: <MaterialIcons name="close" size={140} color="white" />,
    text: "Критичне відхилення",
    borderCol:"#c96a6a"
  },
  disconnected: {
    color: "#9E9E9E", // сірий
    icon: <FontAwesome5 name="plug" size={40} color="white" />,
    text: "Останній відомий стан",
    borderCol:"#616161 "
  },
  nodata: {
    color: "#BDBDBD", // ще світліше сірий
    icon: <Entypo name="help" size={40} color="white" />,
    text: "Немає даних",
    borderCol:"#8d8d8d "
  },
};



export default function GHGreatIndicator ({ status, isConnected }: Props) {
  const config = statusConfig[status];
  const [fontsLoaded] = useFonts({
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Italic": require("../assets/fonts/Nunito-Italic.ttf"),
    "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
  });
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: config.color, borderColor: config.borderCol, borderWidth:1 }]}>
        {config.icon}
      </View>
      <Text style={[styles.statusText, {color: config.borderCol}]}>{config.text}</Text>
      {!isConnected && (
        <Text style={styles.noteText}>Теплиця не підключена до пристрою</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: "50%",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    marginTop: 10,
    fontSize: 18,
    // fontWeight: "bold",
    color: "#333",
    fontFamily: "Nunito-Regular",
  },
  noteText: {
    marginTop: 5,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    fontFamily: "Nunito-Italic",
  },
});

