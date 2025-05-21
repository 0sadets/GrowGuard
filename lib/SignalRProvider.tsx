import React, { createContext, useContext, useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from "@microsoft/signalr";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "http://192.168.1.101:5004";

type SignalRContextType = {
  connection: HubConnection | null;
};

const SignalRContext = createContext<SignalRContextType>({ connection: null });

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider = ({ children }: { children: React.ReactNode }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/sensorHub`, {
        accessTokenFactory: async () => {
          const token = await AsyncStorage.getItem('jwtToken');
          return token ?? '';
        },
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log("✅ SignalR глобально підключено");
      })
      .catch((err) => {
        console.error("❌ Не вдалося підключитися SignalR:", err);
      });

    return () => {
      newConnection.stop();
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
};
