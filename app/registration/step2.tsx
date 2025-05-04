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

  const handleNext = () => {
    router.push("/registration/step3");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "25%",
  },
  inputContainre: {
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%",

  },
  lilInputBlock: {
    display: "flex",
    flexDirection: "column",
    margin:0,
    alignItems:"center",
    // textAlign:"center",
  },
  inputLil: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    width: 60,
    textAlign:"center",
  },
});

const pickerStyles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    // padding: 12,
    marginBottom: 16,
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
