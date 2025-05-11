import { Picker } from "@react-native-picker/picker";
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

export default function StepTwo() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [season, setSeason] = useState("");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [nameFocused, setNameFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [seasonFocused, setSeasonFocused] = useState(false);
  const [lengthFocused, setLengthFocused] = useState(false);
  const [widthFocused, setWidthFocused] = useState(false);
  const [heightFocused, setHeightFocused] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    location: "",
    season: "",
    length: "",
    width: "",
    height: "",
  });

  const validateFields = () => {
    const newErrors = {
      name: "",
      location: "",
      season: "",
      length: "",
      width: "",
      height: "",
    };

    if (!name.trim()) newErrors.name = "Назва є обовʼязковою";
    if (!location.trim()) newErrors.location = "Розташування є обовʼязковим";
    else if (name.length > 100)
      newErrors.name = "Назва не може перевищувати 100 символів";

    if (location.length > 200)
      newErrors.location = "Максимальна довжина — 200 символів";

    if (!season) newErrors.season = "Оберіть сезон";

    if (!length || isNaN(Number(length)) || Number(length) <= 0)
      newErrors.length = "Довжина має бути більше 0";

    if (!width || isNaN(Number(width)) || Number(width) <= 0)
      newErrors.width = "Ширина має бути більше 0";

    if (!height || isNaN(Number(height)) || Number(height) <= 0)
      newErrors.height = "Висота має бути більше 0";

    setErrors(newErrors);

    return Object.values(newErrors).every((val) => val === "");
  };

  const handleNext = () => {
  if (validateFields()) {
    router.push("/registration/step3");
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 170 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BackButton style={styles.backButton} />
          <Image
            source={require("D:/Vodnic/GrowGuard/assets/icons/sprout.png")}
            style={styles.logoImage}
          />
        </View>

        <Text style={styles.title}>Налаштування теплиці</Text>
        <View>
          <View>
            <Text style={styles.inputLabel}>Назва теплиці</Text>
            <TextInput
              style={[styles.input, nameFocused && styles.inputFocused]}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="Введіть назву теплиці"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>
          <View>
            <Text style={styles.inputLabel}>Розташування теплиці</Text>
            <TextInput
              style={[styles.input, locationFocused && styles.inputFocused]}
              onFocus={() => setLocationFocused(true)}
              onBlur={() => setLocationFocused(false)}
              placeholder="Введіть місто"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
            {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
          </View>
          <View>
            <Text style={styles.inputLabel}>Сезон вирощування</Text>
            <View
              style={[
                pickerStyles.inputContainer,
                seasonFocused && pickerStyles.inputFocused,
              ]}
            >
              <Picker
                selectedValue={season}
                onValueChange={(itemValue) => setSeason(itemValue)}
                style={pickerStyles.input}
                onFocus={() => setSeasonFocused(true)}
                onBlur={() => setSeasonFocused(false)}
              >
                <Picker.Item label="Оберіть сезон" value="" />
                <Picker.Item label="Весна" value="spring" />
                <Picker.Item label="Літо" value="summer" />
                <Picker.Item label="Осінь" value="autumn" />
                <Picker.Item label="Зима" value="winter" />
              </Picker>
            </View>
            {errors.season ? <Text style={styles.errorText}>{errors.season}</Text> : null}
          </View>
          <Text style={styles.inputSubTitle}>Параметри теплиці(м)</Text>

          <View style={styles.inputContainre}>
            <View style={styles.lilInputBlock}>
              <Text style={styles.inputLabel}>Довжина</Text>
              <TextInput
                style={[styles.inputLil, lengthFocused && styles.inputFocused]}
                onFocus={() => setLengthFocused(true)}
                onBlur={() => setLengthFocused(false)}
                placeholder="0"
                placeholderTextColor="#999"
                value={length}
                onChangeText={setLength}
              />
            </View>
            <View style={styles.lilInputBlock}>
              <Text style={styles.inputLabel}>Ширина</Text>
              <TextInput
                style={[styles.inputLil, widthFocused && styles.inputFocused]}
                onFocus={() => setWidthFocused(true)}
                onBlur={() => setWidthFocused(false)}
                placeholder="0"
                placeholderTextColor="#999"
                value={width}
                onChangeText={setWidth}
              />
            </View>
            <View style={styles.lilInputBlock}>
              <Text style={styles.inputLabel}>Висота</Text>
              <TextInput
                style={[styles.inputLil, heightFocused && styles.inputFocused]}
                onFocus={() => setHeightFocused(true)}
                onBlur={() => setHeightFocused(false)}
                placeholder="0"
                placeholderTextColor="#999"
                value={height}
                onChangeText={setHeight}
              />
            </View>
          </View>
          {errors.length ? <Text style={styles.errorText}>{errors.length}</Text> : null}
          {errors.width ? <Text style={styles.errorText}>{errors.width}</Text> : null}
          {errors.height  ? <Text style={styles.errorText}>{errors.height }</Text> : null}
        </View>

        <View style={styles.bottomPart}>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Продовжити</Text>
          </TouchableOpacity>

          {/* Індикатори сторінок */}
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={styles.activeDot} />
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
    paddingTop: 5,
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

  logoImage: {
    width: 24,
    height: 24,
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",

    marginBottom: 10,
    color: "#423a3a",
  },
  inputSubTitle: {
    marginTop:24,
    fontSize: 22,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    width: "100%",
  },

  backButton: {
    left: -15,
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
  },

  button: {
    backgroundColor: "#C89F94",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 40,
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
  inputContainre: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  lilInputBlock: {
    display: "flex",
    flexDirection: "column",
    margin: 0,
    alignItems: "center",
    // textAlign:"center",
  },
  inputLil: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    width: 60,
    textAlign: "center",
  },
  errorText: {
  color: "#D9534F",
  marginTop: 4,
  fontSize: 14,
}

});

const pickerStyles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    // padding: 12,
  },
  input: {
    fontSize: 16,
    width: "100%",
  },
  inputFocused: {
    borderColor: "#A4D490",
    borderWidth: 2,
  },
});
