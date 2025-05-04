import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';

interface BackButtonProps {
  style?: ViewStyle; 
}

const BackButton: React.FC<BackButtonProps> = ({ style }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => router.back()}>
      <AntDesign name="left" size={24} color="#C89F94" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    alignSelf: "flex-start",
  },
});

export default BackButton;
