import React from "react";
import { Text, View, useColorScheme } from "react-native";
import Button from "../components/ui/Button";
import { theme } from "../constants/theme";

export default function NoPacers({ onAdd }) {
    const colorScheme = useColorScheme();
    const isDarkTheme = colorScheme === "dark";
  return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}> 
        <Text style={[{ fontSize: 25, fontWeight: "bold" },
          isDarkTheme ? { color: theme.darkColors.text } : { color: theme.lightColors.text }
        ]}>
          No pacers here - yet.
        </Text>
        <Button
          title="Add a Pacer"
          onPress={onAdd}
        />
      </View>
  );
}
