import GreenhouseItem from "@/components/GreenhouseItem";
import { useGreenhouseSignalR } from "@/hooks/useGreenhouseSignalR";
import { getGreenhouseIdBySerialNumber } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Menu } from "react-native-paper";


const SERIAL_NUMBER = "ARDUINO-001";
export default function MainScreen() {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [connectedGreenhouseId, setConnectedGreenhouseId] = useState<
    number | null
  >(null);
  const [connectedStatus, setConnectedStatus] = useState("nodata");

  useEffect(() => {
    const fetchGreenhouseId = async () => {
      try {
        const id = await getGreenhouseIdBySerialNumber(SERIAL_NUMBER);
        setConnectedGreenhouseId(id);
        console.log("🔗 Теплиця, підключена до пристрою:", id);
      } catch (error) {
        console.log("⚠️ Пристрій не підключено до жодної теплиці");
      }
    };

    fetchGreenhouseId();
  }, []);
  useGreenhouseSignalR(connectedGreenhouseId, setConnectedStatus);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [fontsLoaded] = useFonts({
    "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Italic": require("../../assets/fonts/Nunito-Italic.ttf"),
  });
  // const loadGreenhouses = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await getUserGreenhouses();
  //     setGreenhouses(data);
  //   } catch (error) {
  //     console.error("❌ Не вдалося завантажити теплиці:", error);
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   loadGreenhouses();
  // }, []);
  const handleCreate = () => {
    router.push("../forms/createGreenhouse");
  };

  if (!fontsLoaded) {
    return <Text>Завантаження шрифтів...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          {/* Шапка */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Image
                source={require("D:/Vodnic/GrowGuard/assets/icons/sprout.png")}
                style={styles.logoImage}
              />
              <Text style={styles.logoText}>GrowGuard</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                paddingRight: 16,
              }}
            >
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity onPress={openMenu}>
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color="#4C6E45"
                    />
                  </TouchableOpacity>
                }
              >
                <Menu.Item onPress={() => {}} title="Видалити" />
              </Menu>
            </View>
          </View>

          <Text style={styles.title}>Мої теплиці</Text>

          {/* <FlatList
            data={greenhouses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <GreenhouseItem
                greenhouse={item}
                onPress={() =>
                  router.push({
                    pathname: "../greenhouse/gh_details",
                    params: { id: item.id },
                  })
                }
              />
            )}
            refreshing={loading}
            onRefresh={loadGreenhouses}
          /> */}
          <GreenhouseItem
            name={`Теплиця №${connectedGreenhouseId ?? "?"} `}
            status={connectedStatus} // ← динамічно оновлюється
            isRealTime
          />
          {/* <GreenhouseItem name={`Теплиця #${6}`} status={status} /> */}

          <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
            <Ionicons name="add" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  logoText: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    // fontWeight: "bold",
    color: "#634846",
    marginTop: 4,
    marginLeft: 4,
  },
  logoImage: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
    color: "#7A5848",
    fontFamily: "Nunito-Regular",
  },
  headerTitle: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    paddingLeft: 10,
  },
  list: {
    paddingBottom: 100,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fefefe",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 0.3,
    borderColor: "#ddd",

    shadowColor: "#000",
    shadowOpacity: 0.01,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "Nunito-Regular",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#9be68d",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
});
