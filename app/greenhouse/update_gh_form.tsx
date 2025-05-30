import BackButton from "@/components/BackButton";
import {
  getGreenhouseById,
  plantWithExamples,
  updateGreenhouseSettings,
} from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Picker } from "@react-native-picker/picker";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
interface Plant {
  id: number;
  category: string;
  optimalAirTempMin: number;
  optimalAirTempMax: number;
  optimalAirHumidityMin: number;
  optimalAirHumidityMax: number;
  optimalSoilHumidityMin: number;
  optimalSoilHumidityMax: number;
  optimalSoilTempMin: number;
  optimalSoilTempMax: number;
  optimalLightMin: number;
  optimalLightMax: number;
  optimalLightHourPerDay: number;
  exampleNames: string;
  features: string;
}

interface Greenhouse {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  season: string;
  location: string;
  plants: Plant[];
}

export default function UpdateGHForm() {
  const { id } = useLocalSearchParams();
  console.log("id: ", id);
  const [greenhouse, setGreenhouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [season, setSeason] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  // Фокуси для стилів
  const [nameFocused, setNameFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [seasonFocused, setSeasonFocused] = useState(false);
  const [lengthFocused, setLengthFocused] = useState(false);
  const [widthFocused, setWidthFocused] = useState(false);
  const [heightFocused, setHeightFocused] = useState(false);
  // рослини
  const [categories, setCategories] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    location: "",
    season: "",
    length: "",
    width: "",
    height: "",
  });

  const validateFields = () => {
    if (selected.length === 0) {
      setErrorMessage("Будь ласка, оберіть хоча б одну категорію культур.");
      return;
    }
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

  const [fontsLoaded] = useFonts({
    "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Italic": require("../../assets/fonts/Nunito-Italic.ttf"),
    "Nunito-Regular": require("../../assets/fonts/Nunito-Regular.ttf"),
  });
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getGreenhouseById(Number(id));

        setGreenhouse(data);
        setName(data.name || "");
        setLocation(data.location || "");
        setSeason(data.season || "");
        setLength(String(data.length || ""));
        setWidth(String(data.width || ""));
        setHeight(String(data.height || ""));
        if (data?.plants) {
          const plantIds = data.plants.map((plant: Plant) => plant.id);
          setSelected(plantIds);
        }
        console.log(data);
      } catch (err: any) {
        setError(err.message || "Помилка");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await plantWithExamples();
        setCategories(data);
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
        setErrorMessage("Не вдалося завантажити категорії культур.");
      }
    };
    fetchData();

    fetchCategories();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
    );
  }
  const toggleCategory = (id: number) => {
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((item) => item !== id));
    } else if (selected.length < 3) {
      setSelected((prev) => [...prev, id]);
    }
    if (selected.length === 0) {
      setErrorMessage("");
    }
  };

  const openInfo = (examples: string) => {
    setModalText(examples);
    setModalVisible(true);
  };

  if (error) {
    return <Text style={{ color: "red", marginTop: 20 }}>{error}</Text>;
  }
  const onSave = async () => {
    const isValid = validateFields();

    if (!isValid) {
      return;
    }
    const settingsDto = {
      name,
      length,
      width,
      height,
      season,
      location,
      plantIds: selected,
    };
    console.log("settingsDto: ", settingsDto);
    try {
      await updateGreenhouseSettings(Number(id), settingsDto);
      alert("Налаштування успішно збережено!");
      // за потреби: navigation.goBack() або navigate
      router.back();
    } catch (error) {
      alert("Помилка при збереженні налаштувань");
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
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>{greenhouse.name}</Text>
            <FontAwesome6
              name="edit"
              size={24}
              color="black"
              style={styles.icon}
            />
          </View>
        </View>
        <View>
          <Text style={styles.inputSubTitle}>Загальна інформація</Text>
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
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
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
            {errors.location ? (
              <Text style={styles.errorText}>{errors.location}</Text>
            ) : null}
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
            {errors.season ? (
              <Text style={styles.errorText}>{errors.season}</Text>
            ) : null}
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
                keyboardType="numeric"
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
                keyboardType="numeric"
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
                keyboardType="numeric"
              />
            </View>
          </View>
          {errors.length ? (
            <Text style={styles.errorText}>{errors.length}</Text>
          ) : null}
          {errors.width ? (
            <Text style={styles.errorText}>{errors.width}</Text>
          ) : null}
          {errors.height ? (
            <Text style={styles.errorText}>{errors.height}</Text>
          ) : null}
        </View>
        <Text style={styles.inputSubTitle}>Культури</Text>
        {/* <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selected.includes(item.id) && styles.itemSelected,
              ]}
              onPress={() => toggleCategory(item.id)}
            >
              <Text style={styles.text}>{item.category}</Text>
              <Pressable onPress={() => openInfo(item.exampleNames.join(", "))}>
                <Ionicons name="help-circle-outline" size={22} color="#888" />
              </Pressable>
            </TouchableOpacity>
          )}
        /> */}
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              selected.includes(item.id) && styles.itemSelected,
            ]}
            onPress={() => toggleCategory(item.id)}
          >
            <Text style={styles.text}>{item.category}</Text>
            <Pressable onPress={() => openInfo(item.exampleNames.join(", "))}>
              <Ionicons name="help-circle-outline" size={22} color="#888" />
            </Pressable>
          </TouchableOpacity>
        ))}

        {selected.length >= 3 && (
          <Text style={styles.limitText}>Ви обрали максимум (3) культур</Text>
        )}

        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalText}</Text>
            </View>
          </Pressable>
        </Modal>

        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        <View style={styles.bottomPart}>
          <TouchableOpacity style={styles.button} onPress={onSave}>
            <Text style={styles.buttonText}>Зберегти</Text>
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
    paddingTop: 30,
    backgroundColor: "#F5F5F5",
    justifyContent: "space-between",
  },
  header: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 5,
  },
  backButton: {
    position: "absolute",
    left: -15,
    top: "25%",
    transform: [{ translateY: -12 }], // Щоб вертикально по центру
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: "Nunito-Regular",
    color: "#423a3a",
    textAlign: "center",
  },
  icon: {
    marginLeft: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",

    marginBottom: 10,
    color: "#423a3a",
  },
  inputSubTitle: {
    marginTop: 24,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "white",
    padding: 12,
    fontSize: 16,
    width: "100%",
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
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#A4D490",
  },
  bottomPart: {
    // position: "absolute",
    // bottom: 50,
    // left: 0,
    // right: 0,
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
    backgroundColor: "white",
  },
  errorText: {
    color: "#D9534F",
    marginTop: 4,
    fontSize: 14,
  },
  item: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemSelected: {
    backgroundColor: "#d8f4c8",
  },
  text: {
    fontSize: 16,
  },
  limitText: {
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    maxWidth: "80%",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
});

const pickerStyles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    // padding: 12,
    backgroundColor: "white",
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
