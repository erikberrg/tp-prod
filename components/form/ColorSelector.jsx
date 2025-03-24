import React from "react";
import { View, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { theme } from "../../constants/theme";

export const ColorSelector = ({ selectedColor, onSelectColor }) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const colors = [
    "#009CDF",
    theme.colors.primary,
    "#E23838",
    "#F78200",
    theme.colors.secondary,
    "#5EBD3E",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.colorSelector}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              {
                backgroundColor: color,
                borderWidth: selectedColor === color ? 3 : 0,
                borderColor: isDarkTheme ? theme.darkColors.sectionButton : theme.lightColors.sectionButton,
              },
            ]}
            onPress={() => onSelectColor(color)}
            activeOpacity={1}
          />
        ))}
      </View>
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
  colorSelector: {
    flexDirection: "row",
    height: 50,
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 12,
  },
});
