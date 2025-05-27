export type SensorData = {
  airTemperature: number;
  airHumidity: number;
  soilTemperature: number;
  soilHumidity: number;
  light: number;
  greenhouseId: number;
};

export type StatusWithAlerts = {
  status: "good" | "warning" | "error" | "disconnected" | "nodata";
  alerts: string[];
}