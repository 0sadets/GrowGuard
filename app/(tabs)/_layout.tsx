import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
        name="greenhouse2"
        options={{
          tabBarLabel: "Теплиця",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
