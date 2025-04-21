// Screen that contains a list of user presets

import uuid from "react-native-uuid";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PacerList from "../../components/PacerList";
import bleHelper from "../../helpers/ble";
import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAnimationContext } from "../../components/AnimationContext";
import { theme } from "../../constants/theme";
import { MODES } from "../../constants/modes";
import { handleStart, startPacerAnimation } from "../../helpers/handleStart";

export default function ViewPresets() {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const router = useRouter();
  const { setAnimationColor, startAnimation } = useAnimationContext();
  const [pacers, setPacers] = useState([]);
  const [mode, setMode] = useState(MODES.BLUETOOTH);

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    },
  });

  // Load presets from AsyncStorage
  const loadPresets = useCallback(async () => {
    try {
      const savedPacers = await AsyncStorage.getItem("userPresets");
      if (savedPacers) {
        const parsedPacers = JSON.parse(savedPacers);
        setPacers(
          parsedPacers.map((pacer) => ({
            ...pacer,
            id: pacer.id || uuid.v4(),
          }))
        );
      }
    } catch (error) {
      console.error("Error loading pacers:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPresets();
    }, [loadPresets])
  );

  // Delete pacer
  const handleDeletePacer = async (id) => {
    if (!id) {
      console.error("Error: Trying to delete a pacer with an undefined ID");
      return;
    }

    try {
      console.log("Deleted:", id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const updatedPacers = pacers.filter((pacer) => pacer.id !== id);
      await AsyncStorage.setItem("userPresets", JSON.stringify(updatedPacers));
      setPacers(updatedPacers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("runMode").then((saved) => {
      if (saved) setMode(saved);
    });
  }, []);

  // Bluetooth connection helper
  const connectBluetooth = async () => {
    if (!bleHelper.device) {
      await bleHelper.scanAndConnect();
    }
  };

  const updatePacerStats = async (pacer) => {
    try {
      const totalRuns = await AsyncStorage.getItem("totalRuns");
      const totalDistance = await AsyncStorage.getItem("totalDistance");

      const runs = parseInt(totalRuns) || 0;
      const distance = parseInt(totalDistance) || 0;

      const runDistance = pacer.distance * (pacer.repetitions || 1); // default to 1 rep

      await AsyncStorage.setItem("totalRuns", (runs + 1).toString());
      await AsyncStorage.setItem(
        "totalDistance",
        (distance + runDistance).toString()
      );
    } catch (err) {
      console.error("Failed to update stats", err);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkTheme
            ? theme.darkColors.bg
            : theme.lightColors.bg,
          marginBottom: theme.tabBarHeight,
        },
      ]}
    >
      <PacerList
        pacers={pacers}
        onStart={async (pacer) => {
          await handleStart({
            pacer,
            mode,
            connectBluetooth,
            updatePacerStats,
            router,
          });
          await startPacerAnimation(pacer);
        }}
        onDelete={handleDeletePacer}
      />
    </View>
  );
}
