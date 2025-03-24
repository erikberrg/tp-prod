import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import bleHelper from "../helpers/ble";
import { useAnimationContext } from "./AnimationContext"; // Import the context

const Toaster = () => {
  const { resetAnimation } = useAnimationContext(); // Use the reset function
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const toastConfig = {
    pacerToast: () => (
      <View
        style={{
          height: 30,
          borderRadius: 20,
          borderCurve: "continuous",
          display: "flex",
          flexDirection: "row",
          gap: 20,
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: 6,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            bleHelper.sendStop();
            Toast.hide();
            resetAnimation();
          }}
        >
          <View style={{ borderRadius: 16, paddingHorizontal: 6, paddingVertical: 2, display: "flex", flexDirection: "row", gap: 4, justifyContent: "center", alignItems: "center",borderWidth: 1, borderColor: isDarkTheme ? theme.darkColors.icon : theme.lightColors.icon }}>
            <Icon
              name="stop"
              size={24}
              fill={
                isDarkTheme ? theme.darkColors.icon : theme.lightColors.icon
              }
              color={
                isDarkTheme ? theme.darkColors.icon : theme.lightColors.icon
              }
            />
            <Text style={{color: isDarkTheme ? theme.darkColors.icon : theme.lightColors.icon}}>Stop</Text>
          </View>
        </TouchableOpacity>
      </View>
    ),
    bluetoothToast: ({ text1, text2 }) => (
      <View
        style={{
          height: 50,
          width: 200,
          backgroundColor: isDarkTheme
            ? theme.darkColors.section
            : theme.lightColors.bg,
          borderRadius: 40,
          borderCurve: "continuous",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: theme.colors.dark,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          display: "flex",
          flexDirection: "row",
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: isDarkTheme
                ? theme.darkColors.subtext
                : theme.lightColors.subtext,
            }}
          >
            {text1}
          </Text>
          <Text
            style={{
              color: isDarkTheme
                ? theme.darkColors.icon
                : theme.lightColors.icon,
            }}
          >
            {text2}
          </Text>
        </View>
      </View>
    ),
  };
  return <Toast config={toastConfig} />;
};

export default Toaster;
