import React from "react";
import { View, StyleSheet, Text, useColorScheme } from "react-native";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";

export default function Badge({ badge }) {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  return (
    <View
      style={[
        styles.badge,
        {
          borderWidth: 0.6,
          borderColor: isDarkTheme
            ? theme.darkColors.border
            : theme.lightColors.border,
          backgroundColor: isDarkTheme
            ? theme.darkColors.bg
            : theme.lightColors.bg,
        },
      ]}
    >
<Icon name={badge.badge} height={12} color={badge.color || "#333"} />
<Text style={[styles.name, { color: isDarkTheme ? theme.darkColors.subtext : theme.lightColors.subtext }]}>
        {badge.badgeText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  name: {
    fontSize: 8,
    fontWeight: "500",
    textTransform: "uppercase",
  },
});
