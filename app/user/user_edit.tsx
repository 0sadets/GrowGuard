import { getUserInfo, updateUserProfile } from "@/lib/api";
import { AntDesign } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export  default function EditProfileScreen () {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserName(data.userName || "");
        setEmail(data.email || "");
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Помилка",
          text2: "Не вдалося завантажити дані користувача",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSave = async () => {
    if (!userName.trim() && !email.trim()) {
      Toast.show({
        type: "error",
        text1: "Помилка",
        text2: "Введіть хоча б одне поле для оновлення.",
      });
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        UserName: userName.trim(),
        Email: email.trim(),
      });

      Toast.show({
        type: "success",
        text1: "Успіх",
        text2: "Профіль оновлено",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Помилка",
        text2: error?.error || "Не вдалося оновити профіль",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.push({
                pathname: "/userPage",
              })
            }
          >
            <AntDesign name="left" size={24} color="#C89F94" />
          </TouchableOpacity>
          <Text style={styles.title}>Редагування профілю</Text>
        </View>

        <Text style={styles.label}>Ім'я користувача</Text>
        <TextInput
          style={styles.input}
          placeholder="Нове ім'я"
          value={userName}
          onChangeText={setUserName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Новий email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Зберегти</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/user/change_psw")}>
          <Text style={styles.link}> Змінити пароль</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    position: "absolute",
    left: -15,
    padding: 10,
    alignSelf: "flex-start",
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: "Nunito-Regular",
    color: "#423a3a",
    textAlign: "center",
  },
  inner: {
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Nunito-Regular",
    color: "#423a3a",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7A5848",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#6c8cd5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
  link: {
    marginTop: 24,
    color: "gray",
    textAlign: "center",
    fontSize: 16,
    fontFamily:"Nunito-Italic"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
