// Layout screen to wrap the main app

import React from "react";
import { Stack } from "expo-router";
import { AnimationProvider } from "../components/AnimationContext";
import { theme } from "../constants/theme";
import { TouchableOpacity, useColorScheme, Text } from "react-native";
import { useNavigation } from "expo-router";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toaster from "../components/Toaster";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const HeaderLeftButton = ({ isDarkTheme }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ marginLeft: 6 }}
      onPress={() => navigation.goBack()}
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                presentation: "modal",
                title: "New Workout",
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
                headerLeft: () => (
                  <HeaderLeftButton isDarkTheme={isDarkTheme} />
                ),
              })}
            />
            {/* Settings Screen */}
            <Stack.Screen
              name="settings"
              options={({ route }) => ({
                presentation: "modal",
                title: "Settings",
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
                headerLeft: () => (
                  <HeaderLeftButton isDarkTheme={isDarkTheme} />
                ),
              })}
            />

            {/* Workout Screen */}
            <Stack.Screen
              name="workout"
              options={({ route }) => ({
                title: "Workout",
                headerShown: false,
                headerShadowVisible: false,
                headerTintColor: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
                headerStyle: {
                  backgroundColor: isDarkTheme
                    ? theme.darkColors.bg
                    : theme.lightColors.bg,
                },
                headerTitleAlign: "center",
                headerLeft: () => (
                  <HeaderLeftButton isDarkTheme={isDarkTheme} />
                ),
              })}
            />

            {/* Challenge */}
            <Stack.Screen
              name="(modal)/challengeModal"
              options={({ route }) => ({
                presentation: "modal",
                title: "Challenge",
                headerShown: false,
                headerShadowVisible: false,
                headerTintColor: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
                headerStyle: {
                  backgroundColor: isDarkTheme
                    ? theme.darkColors.bg
                    : theme.lightColors.bg,
                },
                headerTitleAlign: "center",
                headerLeft: () => (
                  <HeaderLeftButton isDarkTheme={isDarkTheme} />
                ),
              })}
            />
          </Stack>
          <Toaster />
        </AnimationProvider>
    </GestureHandlerRootView>
  );
};

export default _layout;
