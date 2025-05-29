import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
  HubConnectionState
} from "@microsoft/signalr";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "http://192.168.1.102:5004";

const connection = new HubConnectionBuilder()
  .withUrl(`${API_BASE_URL}/sensorHub`, {
    accessTokenFactory: async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      return token ?? '';
    },
  })
  .withAutomaticReconnect()
  .configureLogging(LogLevel.Information)
  .build();

let isStarted = false;


export const startConnection = async () => {
  if (!isStarted && connection.state === HubConnectionState.Disconnected) {
    try {
      await connection.start();
      isStarted = true;
      console.log("✅ SignalR з'єднання встановлено");
    } catch (error) {
      console.error("❌ Помилка підключення SignalR:", error);
    }
  }
};


export default connection;

