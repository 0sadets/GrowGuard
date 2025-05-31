import BackButton from "@/components/BackButton";
import RangeInputField from "@/components/RangeInputField";
import {
  generateSettings,
  getGreenhouseById,
  getuserSettingsByGHId,
  updateClimateSetting,
} from "@/lib/api";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UpdateSettings() {
  const { id } = useLocalSearchParams();
  console.log("id: ", id);
  const [greenhouse, setGreenhouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const [airTempMin, setairTempMin] = useState("");
  const [airTempMax, setairTempMax] = useState("");

  const [airHumidityMin, setAirHumidityMin] = useState("");
  const [airHumidityMax, setAirHumidityMax] = useState("");

  const [soilHumidityMin, setSoilHumidityMin] = useState("");
  const [soilHumidityMax, setSoilHumidityMax] = useState("");

  const [soilTempMin, setSoilTempMin] = useState("");
  const [soilTempMax, setSoilTempMax] = useState("");

  const [lightMin, setLightMin] = useState("");
  const [lightMax, setLightMax] = useState("");

  // Фокуси для стилів
  const [airTempMinFocused, setairTempMinFocused] = useState(false);
  const [airTempMaxFocused, setairTempMaxFocused] = useState(false);

  const [airHumidityMinFocused, setAirHumidityMinFocused] = useState(false);
  const [airHumidityMaxFocused, setAirHumidityMaxFocused] = useState(false);

  const [soilHumidityMinFocused, setSoilHumidityMinFocused] = useState(false);
  const [soilHumidityMaxFocused, setSoilHumidityMaxFocused] = useState(false);

  const [soilTempMinFocused, setSoilTempMinFocused] = useState(false);
  const [soilTempMaxFocused, setSoilTempMaxFocused] = useState(false);

  const [lightMinFocused, setLightMinFocused] = useState(false);
  const [lightMaxFocused, setLightMaxFocused] = useState(false);

  const [errors, setErrors] = useState({
    airTempMin: "",
    airTempMax: "",
    airHumidityMin: "",
    airHumidityMax: "",
    soilHumidityMin: "",
    soilHumidityMax: "",
    soilTempMin: "",
    soilTempMax: "",
    lightMin: "",
    lightMax: "",
  });

  const validateFields = () => {
    const newErrors = {
      airTempMin: "",
      airTempMax: "",
      airHumidityMin: "",
      airHumidityMax: "",
      soilHumidityMin: "",
      soilHumidityMax: "",
      soilTempMin: "",
      soilTempMax: "",
      lightMin: "",
      lightMax: "",
    };

    const validateNumber = (
      value: string,
      min: number,
      max: number
    ): string => {
      if (value.trim() === "") return "Поле не може бути порожнім";
      const num = Number(value);
      if (isNaN(num)) return "Значення має бути числом";
      if (num < min || num > max) return `Допустимий діапазон: ${min}–${max}`;
      return "";
    };

    // Валідація кожного поля
    newErrors.airTempMin = validateNumber(airTempMin, -20, 60);
    newErrors.airTempMax = validateNumber(airTempMax, -20, 60);
    newErrors.airHumidityMin = validateNumber(airHumidityMin, 0, 100);
    newErrors.airHumidityMax = validateNumber(airHumidityMax, 0, 100);
    newErrors.soilHumidityMin = validateNumber(soilHumidityMin, 0, 100);
    newErrors.soilHumidityMax = validateNumber(soilHumidityMax, 0, 100);
    newErrors.soilTempMin = validateNumber(soilTempMin, -20, 60);
    newErrors.soilTempMax = validateNumber(soilTempMax, -20, 60);
    newErrors.lightMin = validateNumber(lightMin, 0, 100000);
    newErrors.lightMax = validateNumber(lightMax, 0, 100000);

    const num = (val: string) => Number(val);

    // Перевірка: мін не більший за макс
    if (
      !newErrors.airTempMin &&
      !newErrors.airTempMax &&
      num(airTempMin) > num(airTempMax)
    ) {
      newErrors.airTempMin = "Мін. не може бути більшим за макс.";
      newErrors.airTempMax = "Макс. має бути ≥ мін.";
    }
    if (
      !newErrors.airHumidityMin &&
      !newErrors.airHumidityMax &&
      num(airHumidityMin) > num(airHumidityMax)
    ) {
      newErrors.airHumidityMin = "Мін. не може бути більшим за макс.";
      newErrors.airHumidityMax = "Макс. має бути ≥ мін.";
    }
    if (
      !newErrors.soilHumidityMin &&
      !newErrors.soilHumidityMax &&
      num(soilHumidityMin) > num(soilHumidityMax)
    ) {
      newErrors.soilHumidityMin = "Мін. не може бути більшим за макс.";
      newErrors.soilHumidityMax = "Макс. має бути ≥ мін.";
    }
    if (
      !newErrors.soilTempMin &&
      !newErrors.soilTempMax &&
      num(soilTempMin) > num(soilTempMax)
    ) {
      newErrors.soilTempMin = "Мін. не може бути більшим за макс.";
      newErrors.soilTempMax = "Макс. має бути ≥ мін.";
    }
    if (
      !newErrors.lightMin &&
      !newErrors.lightMax &&
      num(lightMin) > num(lightMax)
    ) {
      newErrors.lightMin = "Мін. не може бути більшим за макс.";
      newErrors.lightMax = "Макс. має бути ≥ мін.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((msg) => msg === "");
  };

  const [fontsLoaded] = useFonts({
    "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Italic": require("../../assets/fonts/Nunito-Italic.ttf"),
    "Nunito-Regular": require("../../assets/fonts/Nunito-Regular.ttf"),
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const greenhouseData = await getGreenhouseById(Number(id));
        setGreenhouse(greenhouseData);

        const settingsData = await getuserSettingsByGHId(Number(id));
        if (Array.isArray(settingsData) && settingsData.length > 0) {
          const settings = settingsData[0];

          setairTempMin(String(settings.airTempMin));
          setairTempMax(String(settings.airTempMax));
          setAirHumidityMin(String(settings.airHumidityMin));
          setAirHumidityMax(String(settings.airHumidityMax));
          setSoilHumidityMin(String(settings.soilHumidityMin));
          setSoilHumidityMax(String(settings.soilHumidityMax));
          setSoilTempMin(String(settings.soilTempMin));
          setSoilTempMax(String(settings.soilTempMax));
          setLightMin(String(settings.lightMin));
          setLightMax(String(settings.lightMax));
          console.log("Налаштування успішно завантажені", settings);
        } else {
          console.warn("Немає даних налаштувань для теплиці");
        }
      } catch (err: any) {
        setError(err.message || "Помилка");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
    );
  }

  if (error) {
    return <Text style={{ color: "red", marginTop: 20 }}>{error}</Text>;
  }
  const onSave = async () => {
    const isValid = validateFields();
    if (!isValid) return;
    try {
      const dto = {
        airTempMin: Number(airTempMin),
        airTempMax: Number(airTempMax),
        airHumidityMin: Number(airHumidityMin),
        airHumidityMax: Number(airHumidityMax),
        soilHumidityMin: Number(soilHumidityMin),
        soilHumidityMax: Number(soilHumidityMax),
        soilTempMin: Number(soilTempMin),
        soilTempMax: Number(soilTempMax),
        lightMin: Number(lightMin),
        lightMax: Number(lightMax),
      };

      await updateClimateSetting(Number(id), dto);
      alert("Налаштування успішно оновлено!");
      router.back();
    } catch (error) {
      alert("Помилка при збереженні налаштувань");
      console.error(error);
    }
  };

  const onGenerate = async () => {
    try {
      await generateSettings(Number(id));
      alert("Налаштування успішно згенеровано!");
      router.back();
    } catch (error) {
      alert("Помилка при генерації налаштувань");
      console.error(error);
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
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.sideButton, { left: -15 }]}>
            <BackButton />
          </TouchableOpacity>
          <Text style={styles.pageTitle}> Кліматичні умови</Text>
          <View style={{ position: "relative" }}>
            <TouchableOpacity onPress={() => setShowTooltip(!showTooltip)}>
              <AntDesign name="questioncircleo" size={24} color="#C89F94" />
            </TouchableOpacity>

            {showTooltip && (
              <View style={styles.tooltipBox}>
                <Text style={styles.tooltipText}>
                  Налаштуйте власні оптимальні параметри
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* form */}

        <RangeInputField
          title="Температура повітря"
          minValue={airTempMin}
          maxValue={airTempMax}
          setMinValue={setairTempMin}
          setMaxValue={setairTempMax}
          minFocused={airTempMinFocused}
          maxFocused={airTempMaxFocused}
          setMinFocused={setairTempMinFocused}
          setMaxFocused={setairTempMaxFocused}
          minError={errors.airTempMin}
          maxError={errors.airTempMax}
        />

        <RangeInputField
          title="Вологість повітря"
          minValue={airHumidityMin}
          maxValue={airHumidityMax}
          setMinValue={setAirHumidityMin}
          setMaxValue={setAirHumidityMax}
          minFocused={airHumidityMinFocused}
          maxFocused={airHumidityMaxFocused}
          setMinFocused={setAirHumidityMinFocused}
          setMaxFocused={setAirHumidityMaxFocused}
          minError={errors.airHumidityMin}
          maxError={errors.airHumidityMax}
        />

        <RangeInputField
          title="Вологість ґрунту"
          minValue={soilHumidityMin}
          maxValue={soilHumidityMax}
          setMinValue={setSoilHumidityMin}
          setMaxValue={setSoilHumidityMax}
          minFocused={soilHumidityMinFocused}
          maxFocused={soilHumidityMaxFocused}
          setMinFocused={setSoilHumidityMinFocused}
          setMaxFocused={setSoilHumidityMaxFocused}
          minError={errors.soilHumidityMin}
          maxError={errors.soilHumidityMax}
        />

        <RangeInputField
          title="Температура ґрунту"
          minValue={soilTempMin}
          maxValue={soilTempMax}
          setMinValue={setSoilTempMin}
          setMaxValue={setSoilTempMax}
          minFocused={soilTempMinFocused}
          maxFocused={soilTempMaxFocused}
          setMinFocused={setSoilTempMinFocused}
          setMaxFocused={setSoilTempMaxFocused}
          minError={errors.soilTempMin}
          maxError={errors.soilTempMax}
        />

        <RangeInputField
          title="Освітлення"
          minValue={lightMin}
          maxValue={lightMax}
          setMinValue={setLightMin}
          setMaxValue={setLightMax}
          minFocused={lightMinFocused}
          maxFocused={lightMaxFocused}
          setMinFocused={setLightMinFocused}
          setMaxFocused={setLightMaxFocused}
          minError={errors.lightMin}
          maxError={errors.lightMax}
        />

        <View style={{ justifyContent: "space-between" }}>
          <TouchableOpacity style={styles.button} onPress={onSave}>
            <Text style={styles.buttonText}>Зберегти</Text>
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 10,
              textAlign: "center",
              fontFamily: "Nunito-Italic",
              fontSize: 15,
              color: "#666666",
            }}
          >
            Або
          </Text>
          <TouchableOpacity style={styles.buttonNext} onPress={onGenerate}>
            <Text style={styles.buttonTextNext}>Згенерувати системою</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  sideButton: {
    width: 40,
    alignItems: "center",
  },

  pageTitle: {
    fontSize: 20,
    fontFamily: "Nunito-Regular",
    color: "#423a3a",
    textAlign: "center",
    flex: 1,
    left: -10,
  },

  tooltipBox: {
    position: "absolute",
    top: 25,
    left: -175,
    width: 200,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  tooltipText: {
    fontSize: 14,
    color: "#423a3a",
    textAlign: "center",
    fontFamily: "Nunito-Regular",
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

  buttonNext: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#C89F94",
  },
  buttonTextNext: {
    color: "#C89F94",
    fontSize: 16,
    fontWeight: "600",
  },
});
