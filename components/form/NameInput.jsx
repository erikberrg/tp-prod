import React from "react";
import { TextInput, View, StyleSheet, useColorScheme } from "react-native";
import { theme } from "../../constants/theme";

export const NameInput = ({ value, onChange }) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="words"
        style={[styles.input,{color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text}]}
        value={value}
        placeholder="Name"
        onChangeText={onChange}
        autoFocus
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    fontSize: 16,
    paddingHorizontal: 24,
  },
});
