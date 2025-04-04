// Tab layout screen to navigate between home, add, and presets

import React from "react";
import Icon from "../../assets/icons";
import Toaster from "../../components/Toaster";
import * as Haptics from "expo-haptics";
import { Tabs, useNavigation } from "expo-router";
import { View, Platform, Pressable, useColorScheme, StyleSheet } from "react-native";
import { theme } from "../../constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const _layout = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const navigation = useNavigation();

  // Styles
  const styles = StyleSheet.create({
    tabBar: {
      borderTopWidth: 0,
      height: 90,
      paddingTop: 16,
      backgroundColor: isDarkTheme ? theme.darkColors.bg : theme.lightColors.bg,
    },
    header: {
      backgroundColor: isDarkTheme ? theme.darkColors.bg : theme.lightColors.bg,
    },
    addButtonContainer: {
      height: 50,
      width: 65,
      backgroundColor: isDarkTheme ? theme.darkColors.tabButton : theme.lightColors.tabButton,
      borderRadius: 16,
      borderCurve: "continuous",
      borderWidth: 0.5,
      borderColor: isDarkTheme ? theme.darkColors.border : theme.lightColors.border,
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
    <GestureHandlerRootView>
      <Tabs
        screenOptions={{
          headerLargeTitle: true,
          animation: "shift",
          headerStyle: styles.header,
          headerTintColor: isDarkTheme ? theme.darkColors.text : theme.lightColors.text,
          tabBarShowLabel: false,
          headerShadowVisible: false,
          tabBarActiveTintColor: isDarkTheme ? theme.darkColors.text : theme.lightColors.text,
          tabBarStyle: styles.tabBar,
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "View Track",
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name="home"
                color={color}
                strokeWidth={focused ? 0.5 : 2.5}
                fill={focused ? color : "none"}
                height={28}
                width={28}
              />
            ),
          }}
        />

        {/* Add */}
        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            tabBarIcon: ({ color }) => (
              <View style={styles.addButtonContainer}>
                <Pressable style={styles.addButton} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                  <Icon name="plus" color={color} strokeWidth={2.5} />
                </Pressable>
              </View>
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => e.preventDefault(),
          })}
        />

        {/* Presets */}
        <Tabs.Screen
          name="presets"
          options={{
            title: "View Presets",
            tabBarIcon: ({ color }) => (
              <Icon name="list" color={color} strokeWidth={2.5} height={28} width={28} />
            ),
          }}
        />
      </Tabs>
      <Toaster />
    </GestureHandlerRootView>
  );
};

export default _layout;
