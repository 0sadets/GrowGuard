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

export default function StepOne() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordFocusedColor, setPasswordFocusedColor] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validate = () => {
    let valid = true;
    let newErrors = { username: "", email: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Ім'я користувача є обов’язковим.";
      valid = false;
    } else if (username.length < 3) {
      newErrors.username = "Ім'я має містити щонайменше 3 символи.";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email є обов’язковим.";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Некоректний формат email.";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Пароль є обов’язковим.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Пароль має містити щонайменше 6 символів.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const handleNext = async () => {
    if (!validate()) return;
    router.push("/registration/step2");
    // try {
    //   console.log("Запит на реєстрацію...");
    //   const result = await registerUser(username, email, password);
    //   console.log("Успішна реєстрація:", result);
    //   router.push("/registration/step2");
    // } catch (err) {
    //   console.error("Помилка при реєстрації:", err);
    //   alert("Не вдалося зареєструватися. Перевірте дані.");
    // }
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
          <View></View>
          <Text style={styles.logoText}>GrowGuard</Text>
          <Image
            source={require("D:/Vodnic/GrowGuard/assets/icons/sprout.png")}
            style={styles.logoImage}
          />
        </View>

        <Text style={styles.title}>Створення акаунту</Text>
        <View>
          <View style={styles.inputContainre}>
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

          <View style={styles.inputContainre}>
            {/* еmail */}
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="Ваш email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
          <View style={styles.inputContainre}>
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
            <Text style={styles.buttonText}>Створити акаунт</Text>
          </TouchableOpacity>

          {/* Індикатори сторінок */}
          <View style={styles.dots}>
            <View style={styles.activeDot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
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
    marginBottom: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderBottomColor: "#4C6E45",
    borderBottomWidth: 1,
    paddingBottom: 8,
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
    marginBottom: 80,
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
  inputContainre: {},
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
    width:"100%"
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
    bottom: 20,
    left: 0,
    right: 0,
    
  },

  errorText: {
    color: "#D9534F",
    marginTop: 4,
    fontSize: 13,
  },
});
