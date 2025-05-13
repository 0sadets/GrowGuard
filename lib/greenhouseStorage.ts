import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'greenhouse_temp_data';

export const saveGreenhouseData = async (data: any) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(KEY, jsonValue);
  } catch (e) {
    console.error('Error saving greenhouse data:', e);
  }
};

export const getGreenhouseData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting greenhouse data:', e);
    return null;
  }
};

export const clearGreenhouseData = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.error('Error clearing greenhouse data:', e);
  }
};
