import BackButton from "@/components/BackButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const handleNext = () => {
  router.push("/registration/step3");
};

const dummyCategories = [
  { id: 1, name: "Овочі", examples: "Помідори, огірки, перець" },
  { id: 2, name: "Зелень", examples: "Петрушка, кріп, базилік" },
  { id: 3, name: "Коренеплоди", examples: "Морква, буряк, редька" },
  { id: 4, name: "Ягоди", examples: "Полуниця, малина" },
  { id: 5, name: "Фрукти", examples: "Лимон, апельсин" },
  { id: 6, name: "Тепличні квіти", examples: "Троянди, орхідеї" },
  { id: 7, name: "Гриби", examples: "Печериці, гливи" },
];

export default function SteoThree() {
  const [selected, setSelected] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  const toggleCategory = (id: number) => {
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((item) => item !== id));
    } else if (selected.length < 3) {
      setSelected((prev) => [...prev, id]);
    }
  };

  const openInfo = (examples: string) => {
    setModalText(examples);
    setModalVisible(true);
  };

  return (
    // <KeyboardAvoidingView
    //   style={styles.container}
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    // >
    //   <ScrollView
    //     contentContainerStyle={{ flexGrow: 1 }}
    //     keyboardShouldPersistTaps="handled"
    //     showsVerticalScrollIndicator={false}
    //   >
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
          data={dummyCategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selected.includes(item.id) && styles.itemSelected,
              ]}
              onPress={() => toggleCategory(item.id)}
            >
              <Text style={styles.text}>{item.name}</Text>
              <Pressable onPress={() => openInfo(item.examples)}>
                <Ionicons name="help-circle-outline" size={22} color="#888" />
              </Pressable>
            </TouchableOpacity>
          )}
        />

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
        <View style={styles.bottomPart}>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
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
    paddingTop: 5,
    backgroundColor: "#fff",
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
  pageTitle:{
    fontSize:26,
    textAlign:"center",
    marginBottom:20,
    fontWeight: "500",
  },
  prevPageTitle:{
    fontSize:18,
    color:"#4B382F",
    left: -15,
  },
  item: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    top:-20,
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
});
