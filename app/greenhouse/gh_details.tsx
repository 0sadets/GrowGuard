// screens/GreenhouseDetailsScreen.tsx
import React, { useEffect, useState } from "react";
import { Image, View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getGreenhouseById } from "@/lib/api";
// import { useSignalR } from "@/lib/SignalRProvider";
import { GreenhouseStatusIndicator } from "@/components/StatusIndicator";
import BackButton from "@/components/BackButton";

export default function GreenhouseDetailsScreen() {
  
  // return (
  //   <ScrollView contentContainerStyle={styles.container}>
  //     <View style={styles.header}>
  //       <BackButton style={styles.backButton} />
  //       <Text style={styles.title}>{greenhouse.name}</Text>
  //       <Image
  //         source={require("../../assets/icons/sprout.png")}
  //         style={styles.logoImage}
  //       />
  //     </View>

  //     <GreenhouseStatusIndicator status={status} />
  //   </ScrollView>
  // );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 5,
    marginTop: 15,
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
    fontFamily: "Nunito-Regular",
    textAlign: "center",
    marginBottom: 10,
    color: "#423a3a",
    left: -10,
  },
  backButton: {
    left: -15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
