// lib/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
const API_BASE_URL = "http://192.168.1.101:5004/api"; 
// const API_BASE_URL = "http://192.168.42.22:5004/api"; 

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
export const plantWithExamples = async()=>{
  try{
    const response = await axios.get(`${API_BASE_URL}/Plant/categories-with-examples`);
    console.log(response.data)
    return response.data;
  }
  catch (error: any) {
    console.error("Error fetching plants:", error.response?.data);
    throw error.response?.data || error.message;
  }
}

export const createGreenhouse = async (dto: any) => {
  try {
    console.log(dto)
    const token = await AsyncStorage.getItem("auth_token");
    console.log("Token:", token)
    if (!token) throw new Error("Користувач не авторизований.");
    console.log("Authorization header: ", `Bearer ${token}`);

    const response = await axios.post(`${API_BASE_URL}/Greenhouse/create`, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Помилка при створенні теплиці:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};