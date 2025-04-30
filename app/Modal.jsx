// Modal screen that allows users to create a new pacer

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Animated, { LinearTransition } from "react-native-reanimated";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  Text,
} from "react-native";
import { useNavigation } from "expo-router";
import { theme } from "../constants/theme";
import { NameInput } from "../components/form/NameInput";
import { ColorSelector } from "../components/form/ColorSelector";
import { DistancePicker } from "../components/form/DistancePicker";
import { TimePicker } from "../components/form/TimePicker";

export default function ModalScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const dividerColor = isDarkTheme
    ? theme.darkColors.divider
    : theme.lightColors.divider;
  const [isFormValid, setIsFormValid] = useState(false);

  const styles = StyleSheet.create({
    container: {
      paddingTop: 10,
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: theme.colors.offWhite,
      gap: 10,
    },
    section: {
      width: "90%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      borderRadius: 12,
      borderCurve: "continuous",
    },
  });

  // Define the pacer data state
  const [pacerData, setPacerData] = useState({
    name: "",
    color: "",
    distance: 200,
    minutes: 0,
    seconds: 30,
    hundredths: 0,
  });

  // Handle form validation
  const validateForm = () => {
    const isValid = pacerData.name.trim() && pacerData.color;
    setIsFormValid(isValid);
    return isValid;
  };

  // Update pacer data and validate form
  const handleChange = (key, value) => {
    setPacerData((prev) => {
      const newPacerData = { ...prev, [key]: value };
      validateForm(newPacerData);
      return newPacerData;
    });
  };

  // Function to handle exporting form data
  const handleExportData = async () => {
    try {
      const pacers = await AsyncStorage.getItem("userPresets");
      const pacerList = pacers ? JSON.parse(pacers) : [];
      pacerList.push(pacerData);
      await AsyncStorage.setItem("userPresets", JSON.stringify(pacerList));
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    validateForm();
  }, [pacerData]);

  // Update the header options to add a button to add the pacer
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
      <TouchableOpacity
        onPressIn={handleExportData}
        disabled={!isFormValid}
        style={{ marginRight: 6, padding: 10, }}
      >
        <Text
        style={{
          color: isFormValid
          ? isDarkTheme
            ? theme.darkColors.text
            : theme.lightColors.text
          : isDarkTheme
          ? theme.darkColors.subtext
          : theme.darkColors.subtext,
          fontWeight: theme.fonts.medium,
          fontSize: 18,
        }}
        >
        Add
        </Text>
      </TouchableOpacity>
      ),
    });
  }, [navigation, pacerData, isDarkTheme, isFormValid]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkTheme
            ? theme.darkColors.modalBg
            : theme.lightColors.modalBg,
        },
      ]}
    >
      {/* Name Input */}
      <Animated.View
        layout={LinearTransition}
        style={[
          styles.section,
          {
            backgroundColor: isDarkTheme
              ? theme.darkColors.section
              : theme.lightColors.bg,
          },
        ]}
      >
        <NameInput
          value={pacerData.name}
          onChange={(name) => handleChange("name", name)}
        />

        <Animated.View
          layout={LinearTransition}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              borderBottomColor: dividerColor,
              borderBottomWidth: 0.3,
            }}
          />
        </Animated.View>

        {/* Color Selector */}
        <ColorSelector
          selectedColor={pacerData.color}
          onSelectColor={(color) => handleChange("color", color)}
        />
      </Animated.View>

      <Animated.View
        layout={LinearTransition}
        style={[
          styles.section,
          {
            backgroundColor: isDarkTheme
              ? theme.darkColors.section
              : theme.lightColors.bg,
          },
        ]}
      >
        {/* Distance Picker */}
        <DistancePicker
          selectedDistance={pacerData.distance}
          onSelectDistance={(distance) =>
            setPacerData((prev) => ({ ...prev, distance }))
          }
        />

        <Animated.View
          layout={LinearTransition}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              borderBottomColor: dividerColor,
              borderBottomWidth: 0.3,
            }}
          />
        </Animated.View>

        {/* Time Picker */}
        <TimePicker
          minutes={pacerData.minutes}
          seconds={pacerData.seconds}
          hundredths={pacerData.hundredths}
          onChangeTime={(minutes, seconds, hundredths) =>
            setPacerData((prev) => ({ ...prev, minutes, seconds, hundredths }))
          }
        />
      </Animated.View>
    </View>
  );
}
