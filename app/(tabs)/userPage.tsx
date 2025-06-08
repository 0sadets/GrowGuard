import { getUserGreenhouseSummaries, getUserInfo, logoutUser } from "@/lib/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserPage() {
  const [userData, setUserData] = useState<{
    userName: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [greenhouseCount, setGreenhouseCount] = useState(0);
  const [greenhouseList, setGreenhouseList] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUserData(data);
        const { count, greenhouses } = await getUserGreenhouseSummaries();
        setGreenhouseCount(count);
        setGreenhouseList(greenhouses);
      } catch (error) {
        console.error("Помилка при завантаженні користувача:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <Image
              source={require("D:/Vodnic/GrowGuard/assets/icons/sprout.png")}
              style={styles.logoImage}
            />
            <Text style={styles.logoText}>GrowGuard</Text>
          </View>

          <Text style={styles.title}>Мій акаунт</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#7A5848" />
          ) : userData ? (
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Ім'я користувача:</Text>
              <Text style={styles.value}>{userData.userName}</Text>

              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{userData.email}</Text>

              <Text style={styles.label}>
                Теплиці користувача ({greenhouseCount}):
              </Text>
              {greenhouseList.map((g) => (
                <Pressable
                  key={g.id}
                  onPress={() =>
                    router.push({
                      pathname: "../greenhouse/gh_details",
                      params: { id: g.id },
                    })
                  }
                  style={{
                    backgroundColor: "#F0ECE9",
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    marginTop: 6,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#5A3E36",
                      fontFamily: "Nunito-Regular",
                    }}
                  >
                    {g.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={styles.errorText}>
              Не вдалося завантажити дані користувача
            </Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                router.push("/user/user_edit");
              }}
            >
              <Text style={styles.buttonText}>Редагувати </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                logoutUser();
              }}
            >
              <Text style={styles.buttonText}>Вийти</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#F5F5F5",
  },
  header: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 5,
    width: "100%",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  logoText: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#634846",
    marginTop: 4,
  },
  logoImage: {
    width: 24,
    height: 24,
    position: "absolute",
    left: 15,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
    color: "#5A3E36",
    fontFamily: "Nunito-Bold",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 2,
    borderColor: "#E3D5CE",
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A3E36",
    marginTop: 12,
    fontFamily: "Nunito-Bold",
  },
  value: {
    fontSize: 16,
    color: "#444",
    fontFamily: "Nunito-Regular",
    marginBottom: 6,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#CBB6A8",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  logoutButton: {
    flex: 1,
    backgroundColor: "#7A5848",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
});
