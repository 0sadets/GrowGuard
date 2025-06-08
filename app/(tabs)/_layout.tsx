import { Tabs } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: "#4C6E45",  
        tabBarInactiveTintColor: "#bbb", }}>
      <Tabs.Screen
        name="main"
        options={{
          tabBarLabel: "Теплиця",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="userPage"
        options={{
          tabBarLabel: "Особистий кабінет",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
