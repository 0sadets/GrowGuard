import { getChartData } from "@/lib/api";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

interface SensorGraphDto {
  values: number[];
  min: number;
  max: number;
}

interface SensorChartData {
  airTemp: SensorGraphDto;
  airHum: SensorGraphDto;
  soilTemp: SensorGraphDto;
  soilHum: SensorGraphDto;
  light: SensorGraphDto;
}

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ededed",
  backgroundGradientTo: "#f2f2f2",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`, 
  propsForDots: {
    r: "3",
    strokeWidth: "1",
    stroke: "#588157", 
  },
  propsForLabels: {
    fontSize: 11,
  },
  style: {
    borderRadius: 16,
  },
};

export default function SensorChartsScreen() {
  const [chartData, setChartData] = useState<SensorChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();
  console.log("greenhouseId:", id, "Number(greenhouseId):", Number(id));
  const formatYAxisLabel = (val: string) => {
    const num = Number(val);
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return val;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChartData(Number(id));
        setChartData(data);
      } catch (error) {
        console.error("Помилка при завантаженні графіків:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderChart = (title: string, dataKey: keyof SensorChartData) => {
    const section = chartData![dataKey];

    if (!Array.isArray(section.values) || section.values.length === 0) {
    return (
      <View key={dataKey} style={{ marginVertical: 10, alignItems: "center" }}>
        <Text style={styles.chartTitle}>{title}</Text>
        <Text style={styles.rangeText}>Немає даних для побудови графіка</Text>
      </View>
    );
  }

    const labels = section.values.map((_, i) => (i % 3 === 0 ? `${i}:00` : ""));

    const minLine = Array(section.values.length).fill(section.min);
    const maxLine = Array(section.values.length).fill(section.max);
    const chartWidth = screenWidth - 64;
    return (
      <View
        key={dataKey}
        style={{
          marginVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <Text style={styles.chartTitle}>{title}</Text>
        <View style={{ alignItems: "center" }}>
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: section.values,
                  color: () => "#588157", 
                  strokeWidth: 2,
                  withDots: true,
                },
                {
                  data: minLine,
                  color: () => "#ff7675",
                  strokeWidth: 1,
                  withDots: false,
                },
                {
                  data: maxLine,
                  color: () => "#ff7675", 
                  strokeWidth: 1,
                  withDots: false,
                },
              ],
            }}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            fromZero
            yLabelsOffset={10}
            xLabelsOffset={-5}
            formatYLabel={formatYAxisLabel}
          />
        </View>
        <Text style={styles.rangeText}>
          Діапазон: {section.min} – {section.max}
        </Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (!chartData) {
    return (
      <Text style={{ textAlign: "center", marginTop: 100 }}>
        Немає даних для відображення
      </Text>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.push({
                pathname: "../greenhouse/gh_details",
                params: { id: Number(id) },
              })
            }
          >
            <AntDesign name="left" size={24} color="#C89F94" />
          </TouchableOpacity>
          <Text style={styles.title}>Аналітика теплиці</Text>
        </View>
        {renderChart("Температура повітря (°C)", "airTemp")}
        {renderChart("Вологість повітря (%)", "airHum")}
        {renderChart("Температура ґрунту (°C)", "soilTemp")}
        {renderChart("Вологість ґрунту (%)", "soilHum")}
        {renderChart("Освітлення (лк)", "light")}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    // paddingBottom: 40,
  },
  chartTitle: {
    fontSize: 18,
    // fontWeight: "bold",
    marginBottom: 8,
    fontFamily:"Nunito-Bold",
    color: "#333",
    textAlign: "center", 
    width: "100%", 
  },
  chart: {
    borderRadius: 12,
    alignSelf: "center",
  },
  rangeText: {
    textAlign: "center",
    marginTop: 4,
    color: "#555",
    fontSize: 12,
    fontFamily:"Nunito-Bold",
  },
  header: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    position: "absolute",
    left: -15,
    padding: 10,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 22,
    fontFamily: "Nunito-Regular",
    color: "#423a3a",
    textAlign: "center",
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: "Nunito-Regular",
    color: "#423a3a",
    textAlign: "center",
  },
  inner: {
    padding: 24,
    justifyContent: "center",
  },
});
