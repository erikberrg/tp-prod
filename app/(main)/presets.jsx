// Screen that contains a list of user presets

import uuid from "react-native-uuid";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PacerList from "../../components/PacerList";
import NoPacers from "../../components/NoPacers";
import bleHelper from "../../helpers/ble";
import React, { useState, useCallback } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAnimationContext } from "../../components/AnimationContext";
import {
  calculateRepetition,
  calculateDelay,
  calculateDistance,
  calculateDuration,
} from "../../helpers/calculations";
import { theme } from "../../constants/theme";

export default function ViewPresets() {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const router = useRouter();
  const { setAnimationColor, startAnimation } = useAnimationContext();
  const [pacers, setPacers] = useState([]);

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

  // Bluetooth connection helper
  const connectBluetooth = async () => {
    if (!bleHelper.device) {
      await bleHelper.scanAndConnect();
    }
  };

  // Start pacer helper
  const startPacerAnimation = async (pacer) => {
    await Promise.all([
      bleHelper.sendPacer(pacer.color, pacer.seconds),
      bleHelper.sendTest(pacer.color, pacer.minutes, pacer.distance, pacer.repetitions, pacer.delay),
      startAnimation(
        calculateDuration(pacer.minutes, pacer.seconds),
        calculateDistance(pacer.distance),
        calculateRepetition(pacer.repetitions),
        calculateDelay(pacer.delay)
      ),
    ]);
    setAnimationColor(pacer.color);
  };

  // Start pacer
  const handleStart = async (pacer) => {
    try {
      await connectBluetooth();
      await startPacerAnimation(pacer);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
      router.push("/(main)");
      Toast.show({
        type: "pacerToast",
        position: "bottom",
        bottomOffset: 100,
        visibilityTime: calculateDuration(pacer.minutes, pacer.seconds),
        autoHide: true,
        swipeable: false,
      });
    } catch (error) {
      Toast.show({
        type: "bluetoothToast",
        text1: "Bluetooth",
        text2: "Not Connected",
        position: "top",
        topOffset: 65,
        visibilityTime: 4000,
        autoHide: true,
        swipeable: true,
      });
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
        },
      ]}
    >
      {pacers.length > 0 ? (
        <PacerList
          pacers={pacers}
          onStart={handleStart}
          onDelete={handleDeletePacer}
        />
      ) : (
        <NoPacers onAdd={() => router.push("/Modal")} />
      )}
    </View>
  );
}
