// import { Ionicons } from "@expo/vector-icons";
// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// const getColorByStatus = (status: string): string => {
// //   console.log(status);
//   switch (status) {
//     case "good":
//       return "#9be68d";
//     case "warning":
//       return "#f3d498";
//     case "error":
//       return "#f29d9d";
//     default:
//       return "gray";
//   }
// };

// interface Props {
//   name: string;
//   status: string;
//   isRealTime?: boolean;
// }

// const GreenhouseItem = ({ name, status, isRealTime = false }: Props) => {
//   return (
//     <View style={styles.container}>
//       <View
//         style={[
//           styles.indicator,
//           { backgroundColor: getColorByStatus(status) },
//         ]}
//       />
//       <Text>{name}</Text>
//       <Ionicons name="chevron-forward" size={20} color="#4C6E45" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   indicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 8,
//   },
// });

// export default GreenhouseItem;
