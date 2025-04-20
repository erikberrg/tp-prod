// components/InfoBox.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";

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
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDarkTheme ? 0 : 0.1,
          shadowRadius: 16,
          elevation: 20,
          zIndex: 9999,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 14,
        }}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* Distance */}
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.infoText, { color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text }]}>
              {remainingDistance.toFixed(2).padStart(5, "0")}
            </Text>
            <Text style={{ color: isDarkTheme ? theme.darkColors.subtext : theme.lightColors.subtext }}>meters</Text>
          </View>

          {/* Time */}
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.infoText, { color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text }]}>
              {formatTime(remainingTime)}
            </Text>
            <Text style={{ color: isDarkTheme ? theme.darkColors.subtext : theme.lightColors.subtext }}>time</Text>
          </View>

          {/* Reps / Rest */}
          {isRunning && (
            <View style={{ alignItems: "center" }}>
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
          <TouchableOpacity
            style={styles.connectButton}
            onPress={onConnectPress}
          >
            <Text style={{ fontWeight: "bold", fontSize: 12, color: theme.darkColors.text }}>Connect</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={onStopPress}
          >
            <Icon name="stop" color="white" strokeWidth={3} height="20" />
          </TouchableOpacity>
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
    width: 90,
    height: 35,
    backgroundColor: theme.colors.blue,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  stopButton: {
    width: 35,
    height: 35,
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
