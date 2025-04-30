// Layout screen to wrap the main app

import React from "react";
import { Stack } from "expo-router";
import { AnimationProvider } from "../components/AnimationContext";
import { theme } from "../constants/theme";
import { TouchableOpacity, useColorScheme, Text } from "react-native";
import { useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toaster from "../components/Toaster";

const HeaderLeftButton = ({ isDarkTheme }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
      onPressIn={() => navigation.goBack()}
    >
      <Text
        style={{
          color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text,
          fontSize: 18,
        }}
      >
        Close
      </Text>
    </TouchableOpacity>
  );
};

const _layout = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
      <AnimationProvider>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: isDarkTheme
                ? theme.darkColors.bg
                : theme.lightColors.bg,
            },
          }}
        >
          {/* Main App */}
          <Stack.Screen
            name="(main)"
            options={{
              headerShown: false,
            }}
          />

          {/* Modal Screen */}
          <Stack.Screen
            name="Modal"
            options={({ route }) => ({
              title: "New Workout",
              animation: "fade_from_bottom",
              animationDuration: 100,
              headerShadowVisible: false,
              headerTintColor: isDarkTheme
                ? theme.darkColors.text
                : theme.lightColors.text,
              headerStyle: {
                backgroundColor: isDarkTheme
                  ? theme.darkColors.modalBg
                  : theme.lightColors.modalBg,
              },
              headerTitleAlign: "center",
              headerLeft: () => <HeaderLeftButton isDarkTheme={isDarkTheme} />,
            })}
          />
        </Stack>
        <Toaster />
      </AnimationProvider>
    </GestureHandlerRootView>
  );
};

export default _layout;
