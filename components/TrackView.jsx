// Track View
import bleHelper from "../helpers/ble";
import LottieView from "lottie-react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  useColorScheme,
  Platform,
  Easing,
} from "react-native";
import { useAnimationContext } from "./AnimationContext";
import { theme } from "../constants/theme";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InfoBox from "../components/InfoBox";
import { NativeModules } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
const { LiveActivityManager } = NativeModules;

export const startLiveActivity = (distance, time) => {
  if (Platform.OS === "ios" && LiveActivityManager?.startActivity) {
    LiveActivityManager.startActivity(distance, time);
  }
};

export const updateLiveActivity = (distance, time) => {
  if (Platform.OS === "ios" && LiveActivityManager?.updateActivity) {
    LiveActivityManager.updateActivity(distance, time);
  }
};

export const endLiveActivity = () => {
  if (Platform.OS === "ios" && LiveActivityManager?.endActivity) {
    LiveActivityManager.endActivity();
  }
};

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 90,
  },
  connectionStatusContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: 70,
  },
  connectionText: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
  },
});

const TrackView = ({ pacer = null, autoStart = false }) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const iconColor = isDarkTheme
    ? theme.darkColors.trackOverlay
    : theme.lightColors.trackOverlay;
  const { animationColor, animationProgress, resetAnimation } =
    useAnimationContext();
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [distanceRan, setDistanceRan] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef(null);
  const [currentRep, setCurrentRep] = useState(1);
  const [totalReps, setTotalReps] = useState(pacer?.repetitions || 0);
  const [isConnected, setIsConnected] = useState(false);
  const [pace, setPace] = useState(3);
  const [showQuickStart, setShowQuickStart] = useState(true);

  useEffect(() => {
    if (autoStart && pacer) {
      const distance = Number(pacer.distance) ?? 0;
      const totalTime =
        Number(pacer.minutes ?? 0) * 60 + Number(pacer.seconds ?? 0);
      const reps = Number(pacer.repetitions) || 1;
      const delay = Number(pacer.delay) || 0;
      setRemainingTime(totalTime);
      setRemainingDistance(distance);
      startWorkout(distance, totalTime, reps, delay);
    }
  }, [autoStart, pacer]);

  const checkConnectionStatus = useCallback(() => {
    setConnectionStatus(bleHelper.getConnectionStatus());
  }, []);

  useEffect(() => {
    checkConnectionStatus();
    const interval = setInterval(checkConnectionStatus, 1000);
    return () => clearInterval(interval);
  }, [checkConnectionStatus]);

  const startWorkout = (distance, time, reps = 0, delay = 0) => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    if (Platform.OS === "ios") {
      startLiveActivity(`${distanceRan}`, `${timer}`);
    }

    setTotalReps(reps);
    let currentRepNum = 1;

    const runRep = () => {
      if (currentRepNum > reps) {
        setIsRunning(false);
        return;
      }

      setCurrentRep(currentRepNum);
      setIsRunning(true);

      let timeLeft = time;
      let distanceLeft = distance;
      const distancePerSecond = distance / time;

      timerInterval.current = setInterval(() => {
        timeLeft -= 1;
        distanceLeft -= distancePerSecond;

        setRemainingTime(timeLeft);
        setRemainingDistance(distanceLeft > 0 ? distanceLeft : 0);

        if (Platform.OS === "ios") {
          updateLiveActivity(
            `${(distance - distanceLeft).toFixed(0)}`,
            `${Math.floor(time - timeLeft)}`
          );
        }

        if (timeLeft <= 0) {
          clearInterval(timerInterval.current);

          if (currentRepNum < reps && delay > 0) {
            let delayLeft = delay;

            const delayInterval = setInterval(() => {
              delayLeft -= 1;
              setRestCountdown(delayLeft);

              if (delayLeft <= 0) {
                clearInterval(delayInterval);
                currentRepNum++;
                runRep();
              }
            }, 1000);
          } else if (currentRepNum < reps) {
            currentRepNum++;
            runRep();
          } else {
            stopWorkout();
            if (Platform.OS === "ios") {
              endLiveActivity();
            }
          }
        }
      }, 1000);
    };

    runRep();
  };

  const stopWorkout = async () => {
    setIsRunning(false);
    setRemainingTime(0);
    setRemainingDistance(0);
    setCurrentRep(0);
    setTotalReps(0);
    setShowQuickStart(false);
    setTimeout(() => setShowQuickStart(true), 500); // wait 0.5s before showing it
    if (Platform.OS === "ios") {
      endLiveActivity();
    }

    try {
      bleHelper.sendStop();
      resetAnimation();
      Toast.show({
        type: "messageToast",
        position: "top",
        topOffset: 60,
        visibilityTime: 5000,
        autoHide: true,
        swipeable: true,
        text1: "Workout Ended",
        text2: "runner",
      });
      const storedRuns = await AsyncStorage.getItem("totalRuns");
      const storedDist = await AsyncStorage.getItem("totalDistance");

      const newRunCount = (parseInt(storedRuns) || 0) + 1;
      const newDistance = (parseInt(storedDist) || 0) + Math.floor(distanceRan);

      await AsyncStorage.setItem("totalRuns", newRunCount.toString());
      await AsyncStorage.setItem("totalDistance", newDistance.toString());
    } catch (err) {
      console.error("Failed to end workout:", err);
    }
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(1, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Bluetooth connection helper
  const connectBluetooth = async () => {
    if (!bleHelper.device) {
      await bleHelper.scanAndConnect();
    }
  };

  const handleDisconnect = async () => {
    console.log("🔌 Disconnecting...");
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
        visibilityTime: 5000,
        autoHide: true,
        swipeable: true,
        text1: "Device connected",
        text2: "bluetooth",
      });
    } catch (error) {
      console.error("Failed to connect:", error);
      Toast.show({
        type: "messageToast",
        position: "top",
        topOffset: 60,
        visibilityTime: 5000,
        autoHide: true,
        swipeable: true,
        text1: "Device not connected",
        text2: "bluetooth",
      });
    }
  };

  const handleQuickStart = async () => {
    try {
      let time = 0;
      let distance = 0;

      if (isNaN(pace) || pace <= 0) {
        Toast.show({
          type: "error",
          text1: "Invalid pace",
          text2: "Enter meters per second (e.g., 3)",
        });
        return;
      }

      const lapDistance = 200; // meters
      const lapDuration = lapDistance / pace; // seconds

      // ✅ Send to ESP32
      if (bleHelper.device) {
        await bleHelper.sendPacer("red", lapDuration, lapDistance);
      }

      if (timerInterval.current) clearInterval(timerInterval.current);

      setRemainingTime(0);
      setRemainingDistance(0);
      setDistanceRan(0);
      setIsRunning(true);

      if (Platform.OS === "ios") {
        startLiveActivity("0", "0");
      }

      // ✅ Start animation synced to lap
      animationProgress.current.setValue(0);
      Animated.loop(
        Animated.timing(animationProgress.current, {
          toValue: 1,
          duration: lapDuration * 1000, // convert seconds to ms
          easing: Easing.linear, // ✅ makes it perfectly smooth
          useNativeDriver: false,
        })
      ).start();

      // ✅ Count up time and distance
      timerInterval.current = setInterval(() => {
        time += 1;
        distance += pace;

        setRemainingTime(time);
        setRemainingDistance(distance);
        setDistanceRan(distance);

        if (Platform.OS === "ios") {
          updateLiveActivity(`${Math.floor(distance)}`, `${time}`);
        }
      }, 1000);
    } catch (error) {
      console.error("Quick Start error:", error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkTheme
            ? theme.darkColors.trackBackground
            : theme.lightColors.trackBackground,
        },
      ]}
    >
      <AnimatedLottieView
        style={{ width: "100%", height: "100%", marginBottom: 70 }}
        source={require("../assets/images/track.json")}
        progress={animationProgress.current}
        colorFilters={[
          {
            keypath: "Marker 2",
            color: animationColor,
          },
          {
            keypath: "Track",
            color: isDarkTheme
              ? theme.darkColors.track
              : theme.lightColors.track,
          },
          {
            keypath: "Track Overlay",
            color: isDarkTheme
              ? theme.darkColors.trackOverlay
              : theme.lightColors.trackOverlay,
          },
          {
            keypath: "Track Overlay 1",
            color: isDarkTheme
              ? theme.darkColors.trackOverlayLines
              : theme.lightColors.trackOverlayLines,
          },
          {
            keypath: "Track Overlay 2",
            color: isDarkTheme
              ? theme.darkColors.trackOverlayLines
              : theme.lightColors.trackOverlayLines,
          },
          {
            keypath: "Track Overlay 3",
            color: isDarkTheme
              ? theme.darkColors.trackOverlayLines
              : theme.lightColors.trackOverlayLines,
          },
          {
            keypath: "Track Overlay Marker 1",
            color: animationColor,
          },
          {
            keypath: "Track Overlay Marker 2",
            color: animationColor,
          },
          {
            keypath: "Track Overlay Marker 3",
            color: animationColor,
          },
          {
            keypath: "Start Line 1",
            color: isDarkTheme
              ? theme.darkColors.trackOverlayLines
              : theme.lightColors.trackOverlayLines,
          },
          {
            keypath: "Start Line 2",
            color: isDarkTheme
              ? theme.darkColors.trackOverlayLines
              : theme.lightColors.trackOverlayLines,
          },
          {
            keypath: "Start Line 3",
            color: isDarkTheme
              ? theme.darkColors.trackOverlayLines
              : theme.lightColors.trackOverlayLines,
          },
          {
            keypath: "Start Line",
            color: isDarkTheme
              ? theme.darkColors.trackOverlayLines
              : theme.lightColors.trackOverlayLines,
          },
        ]}
      />
      <InfoBox
        remainingDistance={remainingDistance}
        remainingTime={remainingTime}
        isRunning={isRunning}
        currentRep={currentRep}
        totalReps={totalReps}
        formatTime={formatTime}
        onConnectPress={connectHelper}
        onStopPress={stopWorkout}
        onDisconnectPress={handleDisconnect}
        isConnected={isConnected}
        showQuickStart={showQuickStart}
      />
    </View>
  );
};

export default TrackView;
