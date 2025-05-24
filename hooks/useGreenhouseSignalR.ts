
import connection, { startConnection } from "@/lib/SignalRProvider";
import { useEffect } from "react";

type Callback = (status: string) => void;

export const useGreenhouseSignalR = (
  greenhouseId: number | null,
  onStatusUpdate: Callback
) => {
  useEffect(() => {
    const subscribe = async () => {
      await startConnection();
      console.log(" Стан підключення:", connection.state);


      if (greenhouseId !== null) {
        console.log(` Слухаємо теплицю з ID: ${greenhouseId}`);

         try {
          await connection.invoke("JoinGroup", greenhouseId.toString());
          console.log(` Підключено до групи теплиці ${greenhouseId}`);
        } catch (error) {
          console.error(" Помилка при підключенні до групи:", error);
        }
        connection.off("GreenhouseStatusUpdated");
        connection.on("GreenhouseStatusUpdated", (data) => {
          console.log(" Отримано статус як є:", JSON.stringify(data)); 
            if (data && data.status) {
                onStatusUpdate(data.status);
            } else {
                console.warn("⚠️ Невідомий формат повідомлення:", data);
             }
        });
        
      }
    };

    subscribe();

    return () => {
      connection.off("GreenhouseStatusUpdated");
    };
  }, [greenhouseId, onStatusUpdate]);
};
