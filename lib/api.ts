// lib/api.ts
// import { GreenhouseStatus } from '@/types/greenhouse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
const API_BASE_URL = "http://192.168.1.101:5004/api"; 
// const API_BASE_URL = "http://192.168.42.22:5004/api"; 
const api = axios.create({
  baseURL: API_BASE_URL,
});


api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await AsyncStorage.getItem("refresh_token");
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/Auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = refreshResponse.data;
        await AsyncStorage.setItem("auth_token", accessToken);

        // 🔁 Повторити оригінальний запит з новим токеном
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.clear(); // Видалити токени
        return Promise.reject(refreshError); // Викинути з системи
      }
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Auth/register`, {
      userName: username,
      email,
      password,
    });

    const { accessToken, refreshToken } = response.data;

    await AsyncStorage.setItem("auth_token", accessToken);
    await AsyncStorage.setItem("refresh_token", refreshToken);

    return { accessToken, refreshToken };

  } catch (error: any) {
    console.error("Error response:", error.response?.data);
    console.error("Error message:", error.message);
    throw error.response?.data || error.message;
  }
};
  
export const loginUser = async(username: string, password: string)=>{
  try{
    const response = await axios.post(`${API_BASE_URL}/Auth/login`, {
      userName: username,
      password,
    });
    const { accessToken, refreshToken } = response.data;
    await AsyncStorage.setItem("auth_token", accessToken);
    await AsyncStorage.setItem("refresh_token", refreshToken);

    return { accessToken, refreshToken };
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
// export const plantWithExamples = async()=>{
//   try{
//     const response = await axios.get(`${API_BASE_URL}/Plant/categories-with-examples`);
//     console.log(response.data)
//     return response.data;
//   }
//   catch (error: any) {
//     console.error("Error fetching plants:", error.response?.data);
//     throw error.response?.data || error.message;
//   }
// }
export const plantWithExamples = async () => {
  try {
    const response = await api.get("/Plant/categories-with-examples");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching plants:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// export const createGreenhouse = async (dto: any) => {
//   try {
//     console.log(dto)
//     const token = await AsyncStorage.getItem("auth_token");
//     console.log("Token:", token)
//     if (!token) throw new Error("Користувач не авторизований.");
//     console.log("Authorization header: ", `Bearer ${token}`);

//     const response = await axios.post(`${API_BASE_URL}/Greenhouse/create`, dto, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     return response.data;
//   } catch (error: any) {
//     console.error("Помилка при створенні теплиці:", error.response?.data || error.message);
//     throw error.response?.data || error.message;
//   }
// };
export const createGreenhouse = async (dto: any) => {
  try {
    const response = await api.post("/Greenhouse/create", dto);
    return response.data;
  } catch (error: any) {
    console.error("Помилка при створенні теплиці:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


// export const getGreenhouseStatus = async (greenhouseId: number) => {
//   try {
//     const token = await AsyncStorage.getItem("auth_token");
//     if (!token) throw new Error("Користувач не авторизований.");

//     const response = await axios.post(
//       `${API_BASE_URL}/Greenhouse/status`,
//        greenhouseId , // <-- обгорнули у JSON-об’єкт
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error: any) {
//     console.error(
//       "Помилка при отриманні статусу теплиці:",
//       error.response?.data || error.message
//     );
//     throw error.response?.data || error.message;
//   }
// };

export const getGreenhouseStatus = async (greenhouseId: number) => {
  try {
    const response = await api.post("/Greenhouse/status", greenhouseId.toString(), {
  headers: { "Content-Type": "application/json" },
});

    return response.data;
  } catch (error: any) {
    console.error("Помилка при отриманні статусу теплиці:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};



// export const getUserGreenhouses = async () => {
//   try {
//     const token = await AsyncStorage.getItem("auth_token");
//     if (!token) throw new Error("Користувач не авторизований.");
//     console.log("token: ", token);
//     const response = await axios.get(`${API_BASE_URL}/Greenhouse/user-greenhouses`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data; // масив теплиць
//   } catch (error: any) {
//     console.error("Помилка при отриманні теплиць:", error.response?.data || error.message);
//     throw error.response?.data || error.message;
//   }
// };

export const getUserGreenhouses = async () => {
  try {
    const response = await api.get("/Greenhouse/user-greenhouses");
    return response.data;
  } catch (error: any) {
    console.error("Помилка при отриманні теплиць:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// export const getGreenhouseById = async (id: number) => {
//   try {
//     const token = await AsyncStorage.getItem("auth_token");
//     if (!token) throw new Error("Користувач не авторизований.");
    
//     const response = await axios.get(`${API_BASE_URL}/Greenhouse/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error: any) {
//     console.error("Помилка при отриманні деталей теплиці:", error.response?.data || error.message);
//     throw error.response?.data || error.message;
//   }
// };
export const getGreenhouseById = async (id: number) => {
  try {
    const response = await api.get(`/Greenhouse/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Помилка при отриманні деталей теплиці:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// export const getLastSensorData = async (id: number)=>{
//   try {
//     const token = await AsyncStorage.getItem("auth_token");
//     if (!token) throw new Error("Користувач не авторизований.");

//     const response = await axios.get(`${API_BASE_URL}/Sensor/latest/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error: any) {
//     console.error("Помилка при отриманні крайніх даних:", error.response?.data || error.message);
//     throw error.response?.data || error.message;
//   }
// }
export const getLastSensorData = async (id: number) => {
  try {
    const response = await api.get(`/Sensor/latest/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Помилка при отриманні крайніх даних:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getGreenhouseIdBySerialNumber = async (serialNumber: string = "ARDUINO-001") => {
  try {
    const response = await api.get(`/Greenhouse/device/${serialNumber}/greenhouse-id`);
    return response.data as number;
  } catch (error: any) {
    console.error("Не вдалося отримати greenhouseId по serialNumber:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
