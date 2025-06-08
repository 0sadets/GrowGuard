import { changeUserPassword } from "@/lib/api";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Помилка",
        text2: "Будь ласка, заповніть усі поля",
      });
      return;
    }

    setLoading(true);
    try {
      await changeUserPassword({
        CurrentPassword: currentPassword,
        NewPassword: newPassword,
      });

      Toast.show({
        type: "success",
        text1: "Успіх",
        text2: "Пароль успішно змінено",
      });

      setCurrentPassword("");
      setNewPassword("");
      router.push("/userPage");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Помилка",
        text2: error?.error || "Не вдалося змінити пароль",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="left" size={24} color="#C89F94" />
          </TouchableOpacity>
          <Text style={styles.title}>Зміна пароля</Text>
        </View>

        <Text style={styles.label}>Поточний пароль</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Введіть поточний пароль"
            secureTextEntry={!showPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Новий пароль</Text>
        <View style={styles.passwordContainer}>
        <TextInput
           style={[styles.input, { flex: 1 }]}
          placeholder="Введіть новий пароль"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={showNewPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>  
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Змінити пароль</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  inner: {
    padding: 24,
    justifyContent: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  iconContainer: {
    paddingHorizontal: 8,
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
  title: {
    fontSize: 22,
    fontFamily: "Nunito-Regular",
    color: "#423a3a",
    textAlign: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    padding: 8,
  },

  eyeImage: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
    color: "#555",
  },
  input: {
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    paddingLeft:0
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
});
