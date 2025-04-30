import { View, Text, useColorScheme } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";

const Toaster = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const toastConfig = {
    messageToast: ({ text1, text2 }) => (
      <View
        style={{
          backgroundColor: isDarkTheme
            ? theme.darkColors.modalBg
            : theme.lightColors.modalBg,
          borderRadius: 22,
          borderWidth: 0.6,
          borderColor: isDarkTheme
            ? theme.darkColors.border
            : theme.lightColors.border,
          borderCurve: "continuous",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
            paddingVertical: 18,
            paddingHorizontal: 24,
          }}
        >
          <Icon name={text2} size={24} fill={"transparent"} color={isDarkTheme ? theme.darkColors.text : theme.lightColors.text} />
          <Text
            style={{
              fontWeight: "bold",
              color: isDarkTheme
                ? theme.darkColors.text
                : theme.lightColors.text,
              fontSize: 14,
            }}
          >
            {text1}
          </Text>
        </View>
      </View>
    ),
  };
  return <Toast config={toastConfig} />;
};

export default Toaster;
