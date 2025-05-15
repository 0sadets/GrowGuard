import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

interface AppTextProps extends TextProps {
  style?: TextStyle;
}

export default function AppText({ style, children, ...rest }: AppTextProps) {
  return (
    <Text
      style={[{ fontFamily: "Nunito-Regular" }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
