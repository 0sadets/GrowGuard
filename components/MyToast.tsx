import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const MyToast = ({ text1, text2 }: any) => (
  <View style={styles.toastContainer}>
    <Text style={styles.title}>{text1}</Text>
    <Text style={styles.subtitle}>{text2}</Text>
  </View>
);

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7FCC6F",
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7FCC6F",
  },
  subtitle: {
    fontSize: 14,
    color: "#004D40",
  },
});
