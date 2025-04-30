// Tab layout screen to navigate between home, add, and presets

import React from "react";
import Icon from "../../assets/icons";
import { Tabs } from "expo-router";
import {
  Pressable,
  useColorScheme,
  StyleSheet,
  Easing,
} from "react-native";
import { theme } from "../../constants/theme";

const _layout = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  // Styles
  const styles = StyleSheet.create({
    tabBar: {
      borderTopWidth: 0,
      boxShadow: "0px 0px 0px 0px",
      height: 90,
      paddingTop: 16,
      paddingHorizontal: 32,
      backgroundColor: isDarkTheme ? theme.darkColors.bg : theme.lightColors.bg,
      zIndex: 1,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    header: {
      backgroundColor: isDarkTheme ? theme.darkColors.bg : theme.lightColors.bg,
    },
    addButtonContainer: {
      height: 50,
      width: 60,
      backgroundColor: isDarkTheme
        ? theme.darkColors.tabButton
        : theme.lightColors.tabButton,
      borderRadius: 16,
      borderCurve: "continuous",
      borderWidth: 0.5,
      borderColor: isDarkTheme
        ? theme.darkColors.border
        : theme.lightColors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    addButton: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerLargeTitle: true,
        headerStyle: styles.header,
        headerTintColor: isDarkTheme
          ? theme.darkColors.text
          : theme.lightColors.text,
        tabBarShowLabel: false,
        headerShadowVisible: false,
        tabBarActiveTintColor: isDarkTheme
          ? theme.darkColors.text
          : theme.lightColors.text,
        tabBarStyle: styles.tabBar,
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 75,
            easing: Easing.linear(Easing.ease),
          },
        },
        sceneStyleInterpolator: ({ current }) => ({
          sceneStyle: {
            opacity: current.progress.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [0, 1, 0],
            }),
          },
        }),
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Track Pacer",
          headerShown: true,
          headerStyle: {
            backgroundColor:
                isDarkTheme
                ? theme.darkColors.trackBackground
                : theme.lightColors.trackBackground,
          },
          tabBarStyle: {
            ...styles.tabBar,
            backgroundColor:
                isDarkTheme
                ? theme.darkColors.bg
                : "transparent",
          },
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="home"
              color={color}
              strokeWidth={focused ? 0.5 : 2.5}
              fill={focused ? color : "none"}
              height={26}
              width={26}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={{ color: "transparent" }}
              style={props.style}
            />
          ),
        }}
      />

      {/* Presets */}
      <Tabs.Screen
        name="presets"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color }) => (
            <Icon
              name="runner"
              color={color}
              fill={color}
              strokeWidth={2.5}
              height={26}
              width={26}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={{ color: "transparent" }}
              style={props.style}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
