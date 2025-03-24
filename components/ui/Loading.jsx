import { StyleSheet, View, useColorScheme } from "react-native";
import React from "react";
import { MaterialIndicator } from "react-native-indicators";
import { theme } from "../../constants/theme";

const Loading = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const iconColor = isDarkTheme
    ? theme.darkColors.divider
    : theme.lightColors.divider;
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <MaterialIndicator size={16} color={iconColor} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
