// components/InfoBox.js
import React, { useState } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { theme } from "../constants/theme";
import AnimatedPressable from "./ui/AnimatedPressable";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import bleHelper from "../helpers/ble";

const InfoBox = ({
  remainingDistance,
  remainingTime,
  isRunning,
  formatTime,
  onStopPress,
  showQuickStart,
}) => {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [justStopped, setJustStopped] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  // Bluetooth connection helper
  const connectBluetooth = async () => {
    if (!bleHelper.device) {
      await bleHelper.scanAndConnect();
    }
  };

  const handleDisconnect = async () => {
    try {
      await bleHelper.disconnect();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
      setIsConnected(false);
      setConnectionStatus(false);
    } catch (error) {
      console.log("Disconnect failed:", error);
    }
  };

  const connectHelper = async () => {
    try {
      await connectBluetooth();
      setConnectionStatus(true);
      setIsConnected(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
      Toast.show({
        type: "messageToast",
        position: "top",
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
        swipeable: true,
        text1: "Connected",
        text2: "bluetooth",
      });
    } catch (error) {
      Toast.show({
        type: "messageToast",
        position: "top",
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
        swipeable: true,
        text1: "Not Connected",
        text2: "bluetooth",
      });
    }
  };

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
          shadowColor: "#222",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDarkTheme ? 0 : 0.1,
          shadowRadius: 8,
          elevation: 20,
          zIndex: 998,
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
            <Text
              style={[
                styles.infoText,
                {
                  color: isDarkTheme
                    ? theme.darkColors.text
                    : theme.lightColors.text,
                },
              ]}
            >
              {remainingDistance.toFixed(0).padStart(1, "0")}
            </Text>
            <Text
              style={{
                color: isDarkTheme
                  ? theme.darkColors.subtext
                  : theme.lightColors.subtext,
              }}
            >
              meters
            </Text>
          </View>

          {/* Time */}
          <View style={{ alignItems: "flex-start", minWidth: 80 }}>
            <Text
              style={[
                styles.infoText,
                {
                  color: isDarkTheme
                    ? theme.darkColors.text
                    : theme.lightColors.text,
                },
              ]}
            >
              {formatTime(remainingTime)}
            </Text>
            <Text
              style={{
                color: isDarkTheme
                  ? theme.darkColors.subtext
                  : theme.lightColors.subtext,
              }}
            >
              time
            </Text>
          </View>
        </View>

        {/* Button */}
        {isRunning ? (
          <AnimatedPressable
            style={styles.stopButton}
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
              setJustStopped(true);
              onStopPress();
              setTimeout(() => {
                setJustStopped(false);
              }, 500);
            }}
          >
            <Text style={styles.connectionText}>Stop</Text>
          </AnimatedPressable>
        ) : !justStopped && connectionStatus ? (
          <AnimatedPressable
            style={styles.stopButton}
            onPress={handleDisconnect}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            onPressOut={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
            }}
          >
            <Text style={styles.connectionText}>Disconnect</Text>
          </AnimatedPressable>
        ) : (
          !justStopped && (
            <AnimatedPressable
              style={styles.connectButton}
              onPress={connectHelper}
              onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              onPressOut={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
              }}
            >
              <Text style={styles.connectionText}>Connect</Text>
            </AnimatedPressable>
          )
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
    borderRadius: 20,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default InfoBox;
