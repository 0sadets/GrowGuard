import { getRecommendationById, getuserSettingsByGHId } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type Props = {
  greenhouseId: number;
};

const DoubleDropdown: React.FC<Props> = ({ greenhouseId }) => {
  const [expandedSection, setExpandedSection] = useState<
    "norms" | "recommendations" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [norms, setNorms] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Italic": require("../../assets/fonts/Nunito-Italic.ttf"),
    "Nunito-Regular": require("../../assets/fonts/Nunito-Regular.ttf"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recommendationData, normsData] = await Promise.all([
          getRecommendationById(greenhouseId),
          getuserSettingsByGHId(greenhouseId),
        ]);
        setRecommendation(recommendationData);
        setNorms(normsData[0]);
      } catch (err: any) {
        setError(
          typeof err === "string" ? err : "Помилка при завантаженні даних"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [greenhouseId]);
  const renderSeasonText = () => {
    switch (recommendation.season) {
      case "summer":
        return "Літо-Осінь";
      case "autumn":
        return "Осінь-Зима";
      case "spring":
        return "Весна-Літо";
      case "winter":
        return "Зима-Весна";
      case "undefined":
        return "Не визначений";
      default:
        return "Невідомо";
    }
  };
  const toggleSection = (section: "norms" | "recommendations") => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={{ marginTop: 24 }}
        size="large"
        color="#4C6E45"
      />
    );
  }

  if (error) {
    return <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Норми */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => toggleSection("norms")}
        >
          <Text style={styles.headerText}>Норми</Text>
          <Ionicons
            name={expandedSection === "norms" ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4C6E45"
          />
        </TouchableOpacity>
        {expandedSection === "norms" && norms && (
          <View style={styles.content}>
            <Text style={styles.TableTitle}>
              Таблиця оптимальних параметрів для вашої теплиці
            </Text>
            <View style={styles.tableContainer}>
              <View
                style={[
                  styles.partTable,
                  {
                    borderColor: "#f0f4ef",
                    borderRightWidth: 2,
                  },
                ]}
              >
                <Text style={styles.colTitle}>Температура</Text>
                <View
                  style={[
                    styles.row,
                    {
                      borderColor: "#f0f4ef",
                      borderBottomWidth: 2,
                    },
                  ]}
                >
                  <Text
                    style={{ color: "#666666", fontFamily: "Nunito-Regular" }}
                  >
                    Грунту
                  </Text>
                  <Text style={styles.data}>
                    {norms.soilTempMin} - {norms.soilTempMax}°C
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text
                    style={{ color: "#666666", fontFamily: "Nunito-Regular" }}
                  >
                    Повітря
                  </Text>
                  <Text style={styles.data}>
                    {norms.airTempMin} - {norms.airTempMax}°C
                  </Text>
                </View>
              </View>
              <View style={styles.partTable}>
                <Text style={styles.colTitle}>Вологість</Text>
                <View
                  style={[
                    styles.row,
                    {
                      borderColor: "#f0f4ef",
                      borderBottomWidth: 2,
                    },
                  ]}
                >
                  <Text
                    style={{ color: "#666666", fontFamily: "Nunito-Regular" }}
                  >
                    Грунту
                  </Text>
                  <Text style={styles.data}>
                    {norms.soilHumidityMin} - {norms.soilHumidityMax}%
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text
                    style={{ color: "#666666", fontFamily: "Nunito-Regular" }}
                  >
                    Повітря
                  </Text>
                  <Text style={styles.data}>
                    {" "}
                    {norms.airHumidityMin} - {norms.airHumidityMax}%
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.tableLightContainer}>
              <Text style={styles.Lighttext}>
                Освітлення: {norms.lightMin} — {norms.lightMax} лк
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Рекомендації */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => toggleSection("recommendations")}
        >
          <Text style={styles.headerText}>Рекомендації</Text>
          <Ionicons
            name={
              expandedSection === "recommendations"
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color="#4C6E45"
          />
        </TouchableOpacity>
        {expandedSection === "recommendations" && recommendation && (
        
          <View style={styles.content}>
            <Text style={styles.TableTitle}>
              Рекомендації для вашої теплиці
            </Text>
            <View style={styles.recRow}>
              <View style={styles.recRowTitle}>
                <FontAwesome
                  name="calendar-o"
                  size={20}
                  color="#588157"
                />
                <Text style={styles.recTitle}>Сезон:</Text>
              <Text  style={styles.seasonText}>{renderSeasonText()}</Text>
              </View>
            </View>
            <View style={styles.recRow}>
              <View style={styles.recRowTitle}>
                <FontAwesome6
                  name="temperature-high"
                  size={20}
                  color="#f67280"
                />
                <Text style={styles.recTitle}>Температура:</Text>
              </View>
              <Text style={styles.recText}>
                {recommendation.temperatureAdvice}
              </Text>
            </View>
            <View style={styles.recRow}>
              <View style={styles.recRowTitle}>
                <FontAwesome name="lightbulb-o" size={20} color="#f8b400" />
                <Text style={styles.recTitle}>Освітлення:</Text>
              </View>
              <Text style={styles.recText}>{recommendation.lightAdvice}</Text>
            </View>
            <View style={styles.recRow}>
              <View style={styles.recRowTitle}>
                <FontAwesome6 name="droplet" size={20} color="#4aa3a2" />
                <Text style={styles.recTitle}>Вологість:</Text>
              </View>

              <Text style={styles.recText}>
                {recommendation.humidityAdvice}
              </Text>
            </View>
            <View style={styles.recRow}>
              <View style={styles.recRowTitle}>
                <FontAwesome6 name="plant-wilt" size={20} color="#588157" />
                <Text style={styles.recTitle}>Загальна порада:</Text>
              </View>

              <Text style={styles.recText}>{recommendation.generalTip}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DoubleDropdown;

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    flex: 1,
    width: "100%",
    margin: 0,
  },
  section: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c9dbc8",
    overflow: "hidden",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "#4C6E45",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor:"#FFFFFF"
  },

  TableTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
    borderTopColor: "#c9dbc8",
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  tableContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 3,
  },
  partTable: {
    flexDirection: "column",
    width: "50%",
  },
  colTitle: {
    fontSize: 14,
    fontFamily: "Nunito-Bold",
    color: "#4C6E45",
    textAlign: "center",
    borderColor: "#f0f4ef",
    borderBottomWidth: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
  },
  data: {
    fontFamily: "Nunito-Regular",
    color: "#4C6E45",
    width: "60%",
    textAlign: "center",
  },
  tableLightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 3,
    marginTop: 2,
  },
  Lighttext: {
    fontSize: 14,
    fontFamily: "Nunito-Bold",
    color: "#4C6E45",
    textAlign: "center",
  },
  recRow: {
    flexDirection: "column",
    // backgroundColor:"red",
    padding: 12,
    borderBottomColor: "#b3b5b3",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent:"center",
    alignContent:"center"
  },
  recRowTitle: {
    flexDirection: "row",
  },

  recTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Nunito-Bold",
    color: "#666666",
  },
  recText: {
    width: "100%",
    fontSize: 14,
    fontFamily: "Nunito-Regular",
    color: "#666666",
    marginTop: 5,
    textAlign: "center",
  },
  seasonText:{
    fontSize: 14,
    fontFamily: "Nunito-Regular",
    color: "#666666",
    marginTop:2,
    marginLeft:5
  },
});
