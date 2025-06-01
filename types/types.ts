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

export interface UserSettings {
  airTempMin: number;
  airTempMax: number;
  airHumidityMin: number;
  airHumidityMax: number;
  soilHumidityMin: number;
  soilHumidityMax: number;
  soilTempMin: number;
  soilTempMax: number;
  lightMin: number;
  lightMax: number;
}
export interface Greenhouse {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  season: string;
  location: string;
  plants: Plant[];
}

export interface Plant {
  id: number;
  category: string;
  optimalAirTempMin: number;
  optimalAirTempMax: number;
  optimalAirHumidityMin: number;
  optimalAirHumidityMax: number;
  optimalSoilHumidityMin: number;
  optimalSoilHumidityMax: number;
  optimalSoilTempMax: number;
  optimalSoilTempMin: number;
  optimalLightMin: number;
  optimalLightMax: number;
  optimalLightHourPerDay: number;
  exampleNames: string;
  features: string;
}