import { getGreenhouseStatus, getUserGreenhouses } from "@/lib/api";
import { useSignalR } from "@/lib/SignalRProvider";

import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
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

type Greenhouse = {
  id: number;
  name: string;
  status: "good" | "warning" | "error" | "loading";
};

const getStatusColor = (status: Greenhouse["status"]) => {
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

export default function MainScreen() {
  const { connection } = useSignalR();
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const joinedGroupsRef = useRef<Set<number>>(new Set());

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [fontsLoaded] = useFonts({
    "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Italic": require("../../assets/fonts/Nunito-Italic.ttf"),
  });

  const handleCreate = () => {
    router.push("../forms/createGreenhouse");
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchGreenhouses() {
      try {
        const ghList = await getUserGreenhouses();

        if (!isMounted) return;

        setGreenhouses(
          ghList.map((gh: any) => ({
            id: gh.id,
            name: gh.name,
            status: "loading" as Greenhouse["status"],
          }))
        );
        setLoading(false);

        for (const gh of ghList) {
          try {
            const result = await getGreenhouseStatus(gh.id);
            if (!isMounted) return;
            setGreenhouses((prev) =>
              prev.map((item) =>
                item.id === gh.id ? { ...item, status: result.status } : item
              )
            );
          } catch {
            if (!isMounted) return;
            setGreenhouses((prev) =>
              prev.map((item) =>
                item.id === gh.id ? { ...item, status: "error" } : item
              )
            );
          }
        }
      } catch (error) {
        console.error("Не вдалося отримати теплиці", error);
        if (isMounted) setLoading(false);
      }
    }

    fetchGreenhouses();

    return () => {
      isMounted = false;
    };
  }, []);

  // Підписка на оновлення статусів SignalR
  useEffect(() => {
    if (!connection) return;

    const handleStatusUpdate = (statusDto: {
      greenhouseId: number;
      status: Greenhouse["status"];
    }) => {
      console.log("Отримано оновлення статусу:", statusDto);
      setGreenhouses((prev) =>
        prev.map((gh) =>
          gh.id === statusDto.greenhouseId
            ? { ...gh, status: statusDto.status }
            : gh
        )
      );
    };

    connection.on("GreenhouseStatusUpdated", handleStatusUpdate);

    return () => {
      connection.off("GreenhouseStatusUpdated", handleStatusUpdate);
    };
  }, [connection]);

  // Функція для приєднання до груп
  async function joinGroups(greenhouses: Greenhouse[]) {
    if (!connection) return;

    for (const gh of greenhouses) {
      if (!joinedGroupsRef.current.has(gh.id)) {
        try {
          await connection.invoke("JoinGroup", gh.id.toString());
          joinedGroupsRef.current.add(gh.id);
          console.log(`Приєднано до групи: ${gh.id}`);
        } catch (err) {
          console.warn("Помилка приєднання до групи:", err);
        }
      }
    }
  }

  // Join groups
  useEffect(() => {
    if (!connection || greenhouses.length === 0) return;

    // Якщо зєднання не готове - чекаємо
    if (connection.state !== "Connected") {
      const onConnected = async () => {
        await joinGroups(greenhouses);
        await refreshStatuses(greenhouses);
        connection.off("reconnected", onConnected);
      };
      connection.on("reconnected", onConnected);
      return () => {
        connection.off("reconnected", onConnected);
      };
    } else {
      // Якщо вже підключено - одразу join та оновлення статусів
      (async () => {
        await joinGroups(greenhouses);
        await refreshStatuses(greenhouses);
      })();
    }

    async function refreshStatuses(greenhouses: Greenhouse[]) {
      for (const gh of greenhouses) {
        try {
          const result = await getGreenhouseStatus(gh.id);
          setGreenhouses((prev) =>
            prev.map((item) =>
              item.id === gh.id ? { ...item, status: result.status } : item
            )
          );
        } catch {
          setGreenhouses((prev) =>
            prev.map((item) =>
              item.id === gh.id ? { ...item, status: "error" } : item
            )
          );
        }
      }
    }
  }, [connection, greenhouses]);

  const renderItem = ({ item }: { item: Greenhouse }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({
          pathname: "../greenhouse/gh_details",
          params: { id: item.id },
        })
      }
    >
      <View
        style={[
          styles.statusDot,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color="#4C6E45" />
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return <Text>Завантаження шрифтів...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
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
              contentStyle={{
                backgroundColor: "#fcfcfc",
                borderRadius: 15,
                paddingVertical: 0,
              }}
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

        <FlatList
          data={greenhouses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={() => {
            // Рефреш списку
            setLoading(true);
            setGreenhouses([]);
            joinedGroupsRef.current.clear(); // очищаємо щоб знову приєднатись
            //  повторне завантаження
            (async () => {
              try {
                const ghList = await getUserGreenhouses();
                setGreenhouses(
                  ghList.map((gh: any) => ({
                    id: gh.id,
                    name: gh.name,
                    status: "loading",
                  }))
                );
                setLoading(false);
              } catch {
                setLoading(false);
              }
            })();
          }}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Ionicons name="add" size={36} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
