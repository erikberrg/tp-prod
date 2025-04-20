import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import bleHelper from "../helpers/ble";
import { useAnimationContext } from "./AnimationContext";

const Toaster = () => {
  const { resetAnimation } = useAnimationContext(); // Use the reset function
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const toastConfig = {
    messageToast: ({ text1, text2 }) => (
      <View
        style={{
          height: 60,
          width: 300,
          backgroundColor: isDarkTheme
            ? theme.darkColors.bg
            : theme.lightColors.bg,
          borderRadius: 18,
          borderCurve: "continuous",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#333333",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          boxShadow: '0 0 0 0',
          display: "flex",
          flexDirection: "row",
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Icon name={text2} size={24} fill={"transparent"} color={isDarkTheme ? theme.darkColors.text : theme.lightColors.text} />
          <Text
            style={{
              fontWeight: "bold",
              color: isDarkTheme
                ? theme.darkColors.text
                : theme.lightColors.text,
              fontSize: 18,
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
