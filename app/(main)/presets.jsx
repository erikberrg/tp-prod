// Screen that contains a list of user presets
import uuid from "react-native-uuid";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PacerList from "../../components/PacerList";
import bleHelper from "../../helpers/ble";
import React, { useState, useCallback } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { theme } from "../../constants/theme";
import { handleStart, startPacerAnimation } from "../../helpers/handleStart";
import Toast from "react-native-toast-message";
import { calculateDuration } from "../../helpers/calculations";

export default function ViewPresets() {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const router = useRouter();
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
          try {
            if (!bleHelper.getConnectionStatus()) {
              try {
                await bleHelper.scanAndConnect();
              } catch (scanError) {
                console.log("Color: " + pacer.color);
                console.log(
                  "Lap Time: " +
                    calculateDuration(
                      pacer.minutes,
                      pacer.seconds,
                      pacer.hundredths
                    ) /
                      (pacer.distance / 200)
                );
                console.log(
                  "Segment Delay: " +
                    calculateDuration(
                      pacer.minutes,
                      pacer.seconds,
                      pacer.hundredths
                    ) /
                      (pacer.distance / 200) /
                      5
                );
                console.log(
                  "Total Time: " +
                    calculateDuration(
                      pacer.minutes,
                      pacer.seconds,
                      pacer.hundredths
                    )
                );
                console.warn("Scan failed or timed out");
              }
            }

            // If still not connected, show toast
            if (!bleHelper.getConnectionStatus()) {
              Toast.show({
                type: "messageToast",
                text1: "Not Connected",
                text2: "bluetooth",
                position: "bottom",
                bottomOffset: 90,
                visibilityTime: 4000,
                autoHide: true,
              });
              return;
            }
            await startPacerAnimation(pacer);
            // If connected, continue with the normal flow
            await handleStart({
              pacer,
              connectBluetooth,
              router,
            });
          } catch (err) {
            console.error("Error during start:", err);
          }
        }}
        onDelete={handleDeletePacer}
      />
    </View>
  );
}
