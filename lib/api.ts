// lib/api.ts
import { DeviceStateDto, DeviceUpdateRequest } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const API_BASE_URL = "http://192.168.1.100:5004/api"; 
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

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.clear(); 
        return Promise.reject(refreshError);
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

export const plantWithExamples = async () => {
  try {
    const response = await api.get("/Plant/categories-with-examples");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching plants:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const createGreenhouse = async (dto: any) => {
  try {
    const response = await api.post("/Greenhouse/create", dto);
    return response.data;
  } catch (error: any) {
    console.error("Помилка при створенні теплиці:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const assignDevice = async(dto:any)=>{
   try {
    const response = await api.post("/Greenhouse/assign-device", dto);
   if (response.status === 200) {
      console.log("Пристрій успішно прив'язаний до теплиці.");
      return true;
    } else {
      console.warn("Неочікуваний статус відповіді:", response.status);
      return false;
    }
  } catch (error: any) {
    console.error("Помилка при прив'язці пристрою:", error.response?.data || error.message);
    throw error;
  }
}


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


export const getLastDeviceState = async (greenhouseId: number): Promise<DeviceStateDto> => {
  try {
    const response = await api.get(`/Device/${greenhouseId}/last-state`);
    return response.data;
  } catch (error: any) {
    console.error("Помилка при отриманні останнього стану:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updateDeviceState = async (update: DeviceUpdateRequest): Promise<void> => {
  try {
    await api.post("/Device/state", update);
  } catch (error: any) {
    console.error("Помилка при оновленні стану:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};



export const getUserGreenhouses = async () => {
  try {
    const response = await api.get("/Greenhouse/user-greenhouses");
    return response.data;
  } catch (error: any) {
    console.error("Помилка при отриманні теплиць:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


export const getGreenhouseById = async (id: number) => {
  try {
    const response = await api.get(`/Greenhouse/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Помилка при отриманні деталей теплиці:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


export const getLastSensorData = async (id: number) => {
  try {
    const response = await api.get(`/Sensor/latest/${id}`);
    return response.data;
  } catch (error: any) {
    // console.error("Помилка при отриманні крайніх даних:", error.response?.data || error.message);
    // throw error.response?.data || error.message;
    console.log("Помилка при отриманні крайніх даних:", error.response?.data || error.message);
  }
};

export const getGreenhouseIdBySerialNumber = async (serialNumber: string = "ARDUINO-001") => {
  try {
    const response = await api.get(`/Greenhouse/device/${serialNumber}/greenhouse-id`);
    return response.data as number;
  } catch (error: any) {
    console.log("Не вдалося отримати greenhouseId по serialNumber:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getRecommendationById = async (id: number) =>{
  try{
    const response = await api.get(`Greenhouse/${id}/recommendation`);
    return response.data;
  }catch (error:any){
    console.error("Помилка при отриманні рекомендацій теплиці", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getuserSettingsByGHId = async (id: number)=>{
  try{
    const response = await api.get(`/UserSettings/${id}`);
    return response.data;
  }catch (error:any){
    console.error("Помилка при отриманні налаштувань користувача:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updateGreenhouseSettings = async (greenhouseId: number, settingsDto: any) => {
  try {
    const response = await api.put(`/Greenhouse/${greenhouseId}`, settingsDto);
    return response.data; 
  } catch (error) {
    console.error('Помилка оновлення налаштувань:', error);
    throw error;
  }
};
export const updateClimateSetting = async (greenhouseId: number, settingsDto: any) => {
  try {
    const response = await api.put(`/UserSettings/${greenhouseId}`, settingsDto);
    return response.data; 
  } catch (error) {
    console.error('Помилка оновлення налаштувань:', error);
    throw error;
  }
};
export const generateSettings = async (greenhouseId: number)=>{
 try{
    const response = await api.get(`/UserSettings/${greenhouseId}/generate-settings`);
    return response.data;
  }catch (error:any){
    console.error("Помилка при генерації налаштувань користувача:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
}

export const deleteGreenhouse = async (id: number) => {
  try {
    const response = await api.delete(`/Greenhouse/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Помилка при видаленні теплиці:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getUserInfo = async ()=>{
  try{
    const response = await api.get(`User/profile`);
    return response.data;
  }catch (error:any){
    console.log(error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
}
export const getUserGreenhouseSummaries = async () => {
  try {
    const response = await api.get("/Greenhouse/user-greenhouses");

    const greenhouses = response.data.map((g: any) => ({
      id: g.id,
      name: g.name,
    }));

    const count = greenhouses.length;

    return { count, greenhouses };
  } catch (error: any) {
    console.error("Помилка при отриманні теплиць:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const logoutUser = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refresh_token");
     if (refreshToken) {
      await api.post("Auth/logout", { refreshToken });
    }
    console.log(refreshToken)
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("refresh_token");

    Toast.show({
      type: "success",
      text1: "Ви успішно вийшли з акаунту",
      position: "bottom",
    });
    router.replace("../registration/login");
  } catch (error) {
    console.error("Помилка при виході:", error);
    Toast.show({
      type: "error",
      text1: "Помилка при виході",
      text2: "Спробуйте ще раз",
    });
    throw error;
  }
};
export const updateUserProfile = async (dto:any) => {
  try {
    await api.put("/User/profile", dto);
  } catch (error: any) {
    console.error("Помилка оновлення профілю:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const changeUserPassword = async (dto: { CurrentPassword: string; NewPassword: string }) => {
  try {
    await api.put("/User/change-password", dto);
  } catch (error: any) {
    console.error("Помилка зміни пароля:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getChartData = async(id: number)=>{
  try{
    const response = await api.get(`/Sensor/charts/${id}`);
    return response.data;
  }catch (error: any) {
    console.error("Помилка при отриманні даних для графіку:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};