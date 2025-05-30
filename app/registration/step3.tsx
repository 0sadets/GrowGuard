import BackButton from "@/components/BackButton";
import { createGreenhouse, plantWithExamples } from "@/lib/api";
import {
  clearGreenhouseData,
  getGreenhouseData,
} from "@/lib/greenhouseStorage";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


export default function SteoThree() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await plantWithExamples();
        setCategories(data);
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
        setErrorMessage("Не вдалося завантажити категорії культур.");
      }
    };

    fetchCategories();
  }, []);

  const openInfo = (examples: string) => {
    setModalText(examples);
    setModalVisible(true);
  };
  const handleValidation = async () => {
    if (selected.length === 0) {
      setErrorMessage("Будь ласка, оберіть хоча б одну категорію культур.");
      return;
    }

    try {
      const baseData = await getGreenhouseData();
      if (!baseData) throw new Error("Дані теплиці не знайдено");

      const token = await AsyncStorage.getItem("auth_token"); 
      const dto = {
        ...baseData,
        plantIds: selected,
      };
      console.log("DTO перед відправкою:", dto);

      await createGreenhouse(dto);
      await clearGreenhouseData();

      router.push("/(tabs)/main");
    } catch (error) {
      console.error("Не вдалося створити теплицю:", error);
      setErrorMessage("Виникла помилка при створенні теплиці");
    }
  };
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

  // console.log("Категорії:", categories);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.prevPageTitle}>Налаштування теплиці</Text>
        <Image
          source={require("D:/Vodnic/GrowGuard/assets/icons/sprout.png")}
          style={styles.logoImage}
        />
      </View>
      <Text style={styles.pageTitle}>Оберіть культури</Text>

      <FlatList
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
/>

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
      <View style={styles.bottomPart}>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {selected.length >= 3 && (
          <Text style={styles.limitText}>Ви обрали максимум (3) культур</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleValidation}>
          <Text style={styles.buttonText}>Продовжити</Text>
        </TouchableOpacity>

        {/* Індикатори сторінок */}
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.activeDot} />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  backButton: {
    left: -15,
  },
  container: {
    flex: 1,
    paddingHorizontal: 34,
    // paddingTop: 5,
    paddingVertical:40,
    backgroundColor: "#F5F5F5",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoImage: {
    width: 24,
    height: 24,
    marginTop: 4,
  },
  pageTitle: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500",
  },
  prevPageTitle: {
    fontSize: 18,
    color: "#4B382F",
    left: -15,
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
  button: {
    backgroundColor: "#C89F94",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dots: {
    top: -20,
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
    bottom: 40,
    left: 34,
    right: 34,
  },
  errorText: {
    color: "#D9534F",
    fontSize: 14,
    textAlign: "center",
    marginTop: 25,
  },
});
