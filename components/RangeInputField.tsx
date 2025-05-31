import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface RangeInputFieldProps {
  title: string;
  minValue: string;
  maxValue: string;
  setMinValue: (value: string) => void;
  setMaxValue: (value: string) => void;
  minFocused: boolean;
  maxFocused: boolean;
  setMinFocused: (value: boolean) => void;
  setMaxFocused: (value: boolean) => void;
  minError?: string;
  maxError?: string;
}

const RangeInputField: React.FC<RangeInputFieldProps> = ({
  title,
  minValue,
  maxValue,
  setMinValue,
  setMaxValue,
  minFocused,
  maxFocused,
  setMinFocused,
  setMaxFocused,
  minError,
  maxError,
}) => {
  return (
    <>
      <Text style={styles.inputRowTitle}>{title}</Text>
      <View style={styles.inputRow}>
        <View>
          <Text style={styles.inputLabel}>Мін.</Text>
          <TextInput
            style={[styles.input, minFocused && styles.inputFocused]}
            onFocus={() => setMinFocused(true)}
            onBlur={() => setMinFocused(false)}
            placeholder="0"
            placeholderTextColor="#999"
            value={minValue}
            onChangeText={setMinValue}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.rangeDash}>—</Text>
        <View>
          <Text style={styles.inputLabel}>Макс.</Text>
          <TextInput
            style={[styles.input, maxFocused && styles.inputFocused]}
            onFocus={() => setMaxFocused(true)}
            onBlur={() => setMaxFocused(false)}
            placeholder="0"
            placeholderTextColor="#999"
            value={maxValue}
            onChangeText={setMaxValue}
            keyboardType="numeric"
          />
        </View>
      </View>
          {maxError ? <Text style={styles.errorText}>{maxError}</Text> : null}
          {minError ? <Text style={styles.errorText}>{minError}</Text> : null}

    </>
  );
};

const styles = StyleSheet.create({
  inputRowTitle: {
       fontSize: 18,
    // marginBottom: 5,
    marginTop: 10,
    color: "#2C2C2C",
    textAlign: "center",
    fontFamily: "Nunito-Regular",
    borderTopColor: "#ddd",
    paddingTop: 10,
    borderTopWidth: 1,
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 0,
    marginTop:0,
    color: "#2C2C2C",
    textAlign: "center",
    fontFamily: "Nunito-Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "white",
    padding: 12,
    fontSize: 16,
    width: 70,
    textAlign: "center",
  },
 inputFocused: {
    borderColor: "#A4D490",
    borderWidth: 2,
  },
  errorText: {
    color: "#D9534F",
    marginTop: 4,
    fontSize: 14,
    textAlign:"center",
    fontFamily: "Nunito-Italic",
  },
  rangeDash: {
    marginTop: 30,
    fontSize: 20,
    padding: 0,
    fontFamily: "Nunito-Regular",
  },
});

export default RangeInputField;
