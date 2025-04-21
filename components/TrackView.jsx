// Track View

import bleHelper from "../helpers/ble";
import Icon from "../assets/icons";
import LottieView from "lottie-react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Animated, StyleSheet, View, useColorScheme, Text } from "react-native";
import { useAnimationContext } from "./AnimationContext";
import { theme } from "../constants/theme";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InfoBox from "../components/InfoBox";
import { NativeModules } from "react-native";
import { useLocalSearchParams } from "expo-router";
const { LiveActivityManager } = NativeModules;

export const startLiveActivity = (distance, time) => {
  LiveActivityManager.startActivity(distance, time);
};

export const updateLiveActivity = (distance, time) => {
  LiveActivityManager.updateActivity(distance, time);
};

export const endLiveActivity = () => {
  LiveActivityManager.endActivity();
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
    fontWeight: "bold",
  },
});

const TrackView = ({ pacer = null, autoStart = false }) => {
  const { challengeTitle, levelIndex } = useLocalSearchParams();

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
  const [isResting, setIsResting] = useState(false);
  const [restCountdown, setRestCountdown] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

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

  const completeChallenge = async (pacer) => {
    try {
      const stored = await AsyncStorage.getItem("completedBadges");
      const completed = stored ? JSON.parse(stored) : [];

      // Try to find the challenge in challengeData using title
      let badgeKey = pacer.badge || pacer.id || pacer.challengeTitle;

      if (!badgeKey && pacer.title) {
        const match = challengeData.find((c) => c.title === pacer.title);
        if (match) badgeKey = match.badge;
      }

      if (!badgeKey) {
        console.warn("🚫 No badge key found in pacer:", pacer);
        return;
      }

      if (!completed.includes(badgeKey)) {
        completed.push(badgeKey);
        await AsyncStorage.setItem(
          "completedBadges",
          JSON.stringify(completed)
        );
        console.log("✅ Badge saved:", badgeKey);
      }
    } catch (err) {
      console.error("Error saving completed badge:", err);
    }
  };

  const markLevelComplete = async (title, levelIdx) => {
    const storedChallenge = await AsyncStorage.getItem(title);
    if (!storedChallenge) return;

    const updated = JSON.parse(storedChallenge);
    updated.levels[levelIdx].isCompleted = true;

    // Unlock next level if there is one
    if (updated.levels[levelIdx + 1]) {
      updated.levels[levelIdx + 1].isLocked = false;
    }

    // Check if all levels are complete
    const allDone = updated.levels.every((lvl) => lvl.isCompleted);
    console.log("All levels done?", allDone);

    if (allDone) {
      console.log("🏅 Awarding badge from:", updated);
      console.log("🏷️ Badge key:", updated.badge);
      completeChallenge(updated);
    }

    await AsyncStorage.setItem(updated.title, JSON.stringify(updated));
  };

  const startWorkout = (distance, time, reps = 0, delay = 0) => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    startLiveActivity(`${distanceRan}`, `${timer}`);

    setTotalReps(reps);
    let currentRepNum = 1;

    const runRep = () => {
      if (currentRepNum > reps) {
        setIsRunning(false);
        setIsResting(false);
        return;
      }

      setCurrentRep(currentRepNum);
      setIsResting(false);
      setIsRunning(true);

      let timeLeft = time;
      let distanceLeft = distance;
      const distancePerSecond = distance / time;

      timerInterval.current = setInterval(() => {
        timeLeft -= 1;
        distanceLeft -= distancePerSecond;

        setRemainingTime(timeLeft);
        setRemainingDistance(distanceLeft > 0 ? distanceLeft : 0);

        updateLiveActivity(
          `${(distance - distanceLeft).toFixed(0)}`, // how much ran
          `${Math.floor(time - timeLeft)}` // elapsed time in seconds
        );

        if (timeLeft <= 0) {
          clearInterval(timerInterval.current);

          if (currentRepNum < reps && delay > 0) {
            let delayLeft = delay;
            setIsResting(true);
            setRestCountdown(delayLeft);

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
            completeChallenge(pacer);
            markLevelComplete(challengeTitle, parseInt(levelIndex, 10));
          }
        }
      }, 1000);
    };

    runRep();
  };

  const checkConnectionStatus = useCallback(() => {
    setConnectionStatus(bleHelper.getConnectionStatus());
  }, []);

  useEffect(() => {
    checkConnectionStatus();
    const interval = setInterval(checkConnectionStatus, 1000);
    return () => clearInterval(interval);
  }, [checkConnectionStatus]);

  const stopWorkout = async () => {
    setIsRunning(false);
    setRemainingTime(0);
    setRemainingDistance(0);
    setCurrentRep(1);
    setIsResting(false);
    setRestCountdown(0);
    setCurrentRep(0);
    setTotalReps(0);
    endLiveActivity();

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
        text1: "Workout Ended 🎉",
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
      await bleHelper.disconnect(); // <- make sure disconnect is a Promise
      console.log("📡 Disconnected successfully");
      setIsConnected(false);
      setConnectionStatus(false);
    } catch (error) {
      console.log("❌ Disconnect failed:", error);
    }
  };

  const connectHelper = async () => {
    try {
      await connectBluetooth();
      setConnectionStatus(true);
      setIsConnected(true);
      Toast.show({
        type: "messageToast",
        position: "top",
        topOffset: 60,
        visibilityTime: 5000,
        autoHide: true,
        swipeable: true,
        text1: "Bluetooth connected",
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
        source={require("../assets/images/track-5.json")}
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
        isResting={isResting}
        currentRep={currentRep}
        totalReps={totalReps}
        restCountdown={restCountdown}
        formatTime={formatTime}
        onConnectPress={connectHelper}
        onStopPress={stopWorkout}
        onDisconnectPress={handleDisconnect}
        isConnected={isConnected}
      />
      {!connectionStatus && (
        <View style={styles.connectionStatusContainer}>
          <Icon name="bluetooth" size={36} color={iconColor} />
          <Text style={[styles.connectionText, { color: iconColor }]}>
            Not Connect
          </Text>
        </View>
      )}
    </View>
  );
};

export default TrackView;
