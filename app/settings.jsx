import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React, { useState, useEffect } from "react";
import { MODES } from "../constants/modes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import challengeData from "../helpers/challangeData";
import weeklyData from "../helpers/weeklyPacer.json";
import { theme } from "../constants/theme";

const settings = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const [mode, setMode] = useState(MODES.BLUETOOTH);
  const [name, setName] = useState("Set Name");
  const [completedBadges, setCompletedBadges] = useState([]);
  const [totalRuns, setTotalRuns] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const challengeKeys = challengeData.map((c) => c.title); // e.g. "5 Kilometers"
  const weeklyKeys = weeklyData.map((w) => w.id); // e.g. "weekly-03"
  const progressKeys = [...challengeKeys, ...weeklyKeys];

  useEffect(() => {
    const loadMode = async () => {
      const savedMode = await AsyncStorage.getItem("runMode");
      if (savedMode) setMode(savedMode);
    };
    loadMode();
  }, []);

  const handleModeChange = async (newMode) => {
    setMode(newMode);
    await AsyncStorage.setItem("runMode", newMode);
  };
  
  const resetProfile = async () => {
    try {
      // Dynamically collect all progress-related keys

  
      // Add in your existing static keys
      const staticKeys = [
        "userName",
        "completedBadges",
        "totalRuns",
        "totalDistance",
        "workoutHistory",
      ];
  
      const allKeysToRemove = [...staticKeys, ...progressKeys];
  
      await AsyncStorage.multiRemove(allKeysToRemove);
  
      // Reset in-app state
      setName("Set Name");
      setCompletedBadges([]);
      setTotalRuns(0);
      setTotalDistance(0);
      setWorkoutHistory([]);
  
      console.log("🧹 Profile and challenge progress reset!");
    } catch (err) {
      console.error("Error resetting profile:", err);
    }
  };
  

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: isDarkTheme
          ? theme.darkColors.modalBg
          : theme.lightColors.modalBg,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isDarkTheme
            ? theme.darkColors.section
            : theme.lightColors.bg,
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderRadius: 16,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text,
          }}
        >
          Run Mode
        </Text>
        <TouchableOpacity
          onPress={() =>
            handleModeChange(mode === MODES.GPS ? MODES.BLUETOOTH : MODES.GPS)
          }
          style={{
            padding: 10,
            backgroundColor: isDarkTheme
              ? theme.darkColors.sectionButton
              : theme.lightColors.sectionButton,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: isDarkTheme
                ? theme.darkColors.text
                : theme.lightColors.text,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {mode === MODES.GPS ? "GPS" : "Bluetooth"}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isDarkTheme
            ? theme.darkColors.section
            : theme.lightColors.bg,
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderRadius: 16,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text,
          }}
        >
          Measurement
        </Text>
        <TouchableOpacity
          onPress={() =>
            handleModeChange(mode === MODES.KILOMETER ? MODES.MILE : MODES.KILOMETER)
          }
          style={{
            padding: 10,
            backgroundColor: isDarkTheme
              ? theme.darkColors.sectionButton
              : theme.lightColors.sectionButton,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: isDarkTheme
                ? theme.darkColors.text
                : theme.lightColors.text,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {mode === MODES.KILOMETER ? "Kilometers" : "Miles"}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDarkTheme
            ? theme.darkColors.section
            : theme.lightColors.bg,
          paddingHorizontal: 12,
          paddingVertical: 20,
          borderRadius: 16,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text,
            fontWeight: "bold",
          }}
        >
          Submit Feedback
        </Text>
      </View>
      <TouchableOpacity
        onPress={resetProfile}
        style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDarkTheme
            ? theme.darkColors.section
            : theme.lightColors.bg,
          paddingHorizontal: 12,
          paddingVertical: 20,
          borderRadius: 16,
          marginTop: 10,
        }}
      >
        <Text
          style={{ fontSize: 16, color: theme.colors.stop, fontWeight: "bold" }}
        >
          Reset Profile
        </Text>
      </TouchableOpacity>
    </View>
    
  );
};

export default settings;
