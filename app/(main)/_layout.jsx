// Tab layout screen to navigate between home, add, and presets

import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "../../assets/icons";
import * as Haptics from "expo-haptics";
import { MODES } from "../../constants/modes"; // assuming you have this
import { Tabs, useNavigation } from "expo-router";
import {
  Platform,
  Pressable,
  useColorScheme,
  StyleSheet,
  Easing,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";

const _layout = () => {
  useFocusEffect(
    useCallback(() => {
      const loadMode = async () => {
        const savedMode = await AsyncStorage.getItem("runMode");
        setMode(savedMode || MODES.BLUETOOTH); // fallback
      };
      loadMode();
    }, [])
  );
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const navigation = useNavigation();
  const [mode, setMode] = useState(null); // null = loading

  const SettingsButton = ({ isDarkTheme }) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        style={{ marginRight: 12, paddingHorizontal: 12, paddingVertical: 4 }}
        onPress={() => navigation.navigate("settings")}
      >
        <Icon
          name="settings"
          color={isDarkTheme ? theme.darkColors.icon : theme.lightColors.icon}
          fill={"none"}
          size={20}
          strokeWidth={2}
        />
      </TouchableOpacity>
    );
  };

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

  const handlePressIn = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    navigation.navigate("Modal");
  };

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
                duration: 50,
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
              headerShown: mode === MODES.GPS ? false : true,
              headerStyle: {
                backgroundColor:
                  mode === MODES.GPS
                    ? isDarkTheme
                      ? theme.darkColors.bg
                      : theme.lightColors.bg
                    : isDarkTheme
                    ? theme.darkColors.trackBackground
                    : theme.lightColors.trackBackground,
              },
              tabBarStyle: {
                ...styles.tabBar,
                backgroundColor:
                  mode === MODES.GPS
                    ? isDarkTheme
                      ? theme.darkColors.bg
                      : "transparent"
                    : isDarkTheme
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

          {/* Challanges */}
          <Tabs.Screen
            name="challenge"
            options={{
              title: "Challenges",
              tabBarIcon: ({ color }) => (
                <Icon
                  name="clipboard"
                  color={color}
                  strokeWidth={2.5}
                  fill="none"
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

          {/* Profile */}
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              headerRight: () => <SettingsButton isDarkTheme={isDarkTheme} />,
              tabBarIcon: ({ focused, color }) => (
                <Icon
                  name="profile"
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
        </Tabs>
  );
};

export default _layout;
