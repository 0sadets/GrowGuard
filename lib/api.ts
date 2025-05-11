// lib/api.ts
import axios from "axios";

const API_BASE_URL = "http://192.168.1.101:5004/api"; 

export const registerUser = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Auth/register`, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error response:", error.response?.data);
      console.error("Error message:", error.message);
      throw error.response?.data || error.message;
    }
  };
  
export const plantWithExamples = async()=>{
  try{
    const response = await axios.get(`${API_BASE_URL}/Plant/categories-with-examples`);
    return response.data;
  }
  catch (error: any) {
    console.error("Error fetching plants:", error.response?.data);
    throw error.response?.data || error.message;
  }
}