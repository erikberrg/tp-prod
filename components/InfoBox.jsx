// components/InfoBox.js
import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { theme } from "../constants/theme";
import AnimatedPressable from "./ui/AnimatedPressable";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";

const InfoBox = ({
  remainingDistance,
  remainingTime,
  isRunning,
  isResting,
  currentRep,
  totalReps,
  restCountdown,
  formatTime,
  onConnectPress,
  onStopPress,
  connectionStatus
}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  return (
    <>
      <View
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          height: 60,
          backgroundColor: isDarkTheme
            ? theme.darkColors.section
            : theme.lightColors.bg,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDarkTheme ? 0 : 0.1,
          shadowRadius: 16,
          elevation: 20,
          zIndex: 9999,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {/* Distance */}
          <View style={{ alignItems: "flex-start", minWidth: 80 }}>
            <Text style={[styles.infoText, { color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text }]}>
              {remainingDistance.toFixed(0).padStart(2, "0")}
            </Text>
            <Text style={{ color: isDarkTheme ? theme.darkColors.subtext : theme.lightColors.subtext }}>meters</Text>
          </View>

          {/* Time */}
          <View style={{ alignItems: "flex-start", minWidth: 80 }}>
            <Text style={[styles.infoText, { color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text }]}>
              {formatTime(remainingTime)}
            </Text>
            <Text style={{ color: isDarkTheme ? theme.darkColors.subtext : theme.lightColors.subtext }}>time</Text>
          </View>

          {/* Reps / Rest */}
          {isRunning && (
            <View style={{ alignItems: "flex-start", minWidth: 80 }}>
              <Text style={[styles.infoText, { color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text }]}>
                {isResting
                  ? `${restCountdown.toString().padStart(1, "0")}`
                  : `${currentRep.toString().padStart(1, "0")} / ${totalReps.toString().padStart(1, "0")}`}
              </Text>
              <Text style={{ color: isDarkTheme ? theme.darkColors.subtext : theme.lightColors.subtext }}>
                {isResting ? "rest" : "reps"}
              </Text>
            </View>
          )}
        </View>

        {/* Button */}
        {!isRunning ? (
          <AnimatedPressable
            style={styles.connectButton}
            onPress={onConnectPress}
          >
            <Text style={{ fontWeight: "bold", fontSize: 14, color: theme.darkColors.text }}>Connect</Text>
          </AnimatedPressable>
        ) : (
            <AnimatedPressable
              style={{
                width: 100,
                height: 40,
                backgroundColor: theme.colors.stop,
                borderRadius: 25,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                Toast.show({
                  type: "messageToast",
                  position: "top",
                  topOffset: 60,
                  visibilityTime: 5000,
                  autoHide: true,
                  swipeable: true,
                  text1: "Press and hold to stop",
                  text2: "touch",
                });
              }}
              onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              onLongPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                onStopPress();
              }}
            >
            <Text style={{ fontWeight: "bold", fontSize: 14, color: theme.darkColors.text }}>Stop</Text>
            </AnimatedPressable>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 0,
  },
  connectButton: {
    width: 100,
    height: 40,
    backgroundColor: theme.colors.blue,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  stopButton: {
    width: 100,
    height: 40,
    backgroundColor: theme.colors.stop,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  connectionStatusContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    bottom: 70,
  },
  connectionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InfoBox;
