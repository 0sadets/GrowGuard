import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "D:/Vodnic/GrowGuard/components/BackButton";
import { loginUser } from "@/lib/api"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const validate = () => {
    let valid = true;
    let newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Ім'я користувача є обов’язковим.";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Пароль є обов’язковим.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = async () => {
  if (!validate()) return;

  try {
    console.log("Спроба входу...");

    // виклик API
    const { accessToken, refreshToken } = await loginUser(username, password);
    
    console.log("Успішний вхід:", accessToken);

    // Перехід до головної сторінки теплиці
    router.push("/greenhouse/main");
  } catch (error) {
    console.error("Помилка входу:", error);
    alert("Не вдалося увійти. Перевірте ім'я користувача або пароль.");
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* шапка */}
        
        <View style={styles.header}>
          <BackButton style={styles.backButton} />
          <Text style={styles.logoText}>GrowGuard</Text>
          <Image
            source={require("D:/Vodnic/GrowGuard/assets/icons/sprout.png")}
            style={styles.logoImage}
          />
        </View>

        <Text style={styles.title}>Вхід в акаунт</Text>
        <View style={styles.inputContainre}>
          <View >
            {/* імя */}
            <Text style={styles.inputLabel}>Ім'я користувача</Text>
            <TextInput
              style={[styles.input, usernameFocused && styles.inputFocused]}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              placeholder="Ваше ім'я користувача"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />
            {errors.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}
          </View>

          <View >
            {/* пароль */}
            <Text style={styles.inputLabel}>Пароль</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, passwordFocused && styles.inputFocused]}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Ваш пароль"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Image
                  source={
                    showPassword
                      ? require("D:/Vodnic/GrowGuard/assets/icons/9118015_eye_open_icon.png")
                      : require("D:/Vodnic/GrowGuard/assets/icons/9023370_eye_closed_fill_icon.png")
                  }
                  style={styles.eyeImage}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.bottomPart}>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Увійти</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
   header: {
    alignItems: "center",
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    left: -15,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4C6E45",
    marginRight: 15,
    padding: 0,
  },
  logoImage: {
    width: 24,
    height: 24,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 80,
    color: "#423a3a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    // marginBottom: 16,
    width: "100%",
  },
  inputContainre: {
    alignSelf:"center",
    marginTop:30
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    color: "#2C2C2C",
  },
  inputFocused: {
    borderColor: "#A4D490",
    borderWidth: 2,
    outline: "none",
    outlineColor: "none",
    outlineWidth: 0,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    position: "relative",
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
  button: {
    backgroundColor: "#C89F94",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    // marginTop: 40,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    // top: -40,
    marginTop: 60,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0F0D9",
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#A4D490",
  },
  bottomPart: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
  },
  errorText: {
    color: "#D9534F",
    marginTop: 4,
    fontSize: 13,
  },
});
