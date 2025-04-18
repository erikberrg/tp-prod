// Track View

import bleHelper from "../helpers/ble";
import Icon from "../assets/icons";
import LottieView from "lottie-react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  useColorScheme,
  Text,
  TouchableOpacity
} from "react-native";
import { useAnimationContext } from "./AnimationContext";
import { theme } from "../constants/theme";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  infoBox: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 20,
    borderCurve: "continuous",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  info: {
    fontSize: 12,
    marginBottom: 6,
    width: 70,
    textAlign: "center",
  },
});

const TrackView = ({ pacer = null, autoStart = false }) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const iconColor = isDarkTheme
    ? theme.darkColors.track
    : theme.lightColors.track;
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

  const startWorkout = (distance, time, reps = 0, delay = 0) => {
    if (timerInterval.current) clearInterval(timerInterval.current);

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
            setIsResting(false);
            setIsRunning(false);
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

    try {
      bleHelper.sendStop();
      resetAnimation();
      Toast.show({
        type: "completeToast",
        position: "top",
        topOffset: 60,
        visibilityTime: 5000,
        autoHide: true,
        swipeable: true,
        text1: "Workout Ended 🎉",
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

  const connectHelper = async () => {
    try {
      await connectBluetooth();
      setConnectionStatus(true);
      Toast.show({
        type: "bluetoothToast",
        position: "top",
        topOffset: 60,
        visibilityTime: 5000,
        autoHide: true,
        swipeable: true,
        text1: "Bluetooth",
        text2: "Connected",
      })
    } catch (error) {
      console.error("Failed to connect:", error);
      Toast.show({
        type: "bluetoothToast",
        position: "top",
        topOffset: 60,
        visibilityTime: 5000,
        autoHide: true,
        swipeable: true,
        text1: "Bluetooth",
        text2: "Not connected"
      });
    }
  }

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
          elevation: 20, // important for Android
          zIndex: 9999,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 14,
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text
              style={[
                styles.info,
                {
                  color: isDarkTheme
                    ? theme.darkColors.text
                    : theme.lightColors.text,
                  fontWeight: "bold",
                  fontSize: 18,
                  marginBottom: 0,
                },
              ]}
            >
              {remainingDistance.toFixed(2).padStart(5, "0")}
            </Text>
            <Text
              style={{
                color: isDarkTheme
                  ? theme.darkColors.subtext
                  : theme.lightColors.subtext,
                alignSelf: "center",
              }}
            >
              meters
            </Text>
          </View>

          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text
              style={[
                styles.info,
                {
                  color: isDarkTheme
                    ? theme.darkColors.text
                    : theme.lightColors.text,
                  fontWeight: "bold",
                  fontSize: 18,
                  marginBottom: 0,
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
                alignSelf: "center",
              }}
            >
              time
            </Text>
          </View>

          {isRunning && (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.info,
                  {
                    color: isDarkTheme
                      ? theme.darkColors.text
                      : theme.lightColors.text,
                    fontWeight: "bold",
                    fontSize: 18,
                    marginBottom: 0,
                  },
                ]}
              >
                {isResting
                  ? `${restCountdown.toString().padStart(1, "0")}`
                  : `${currentRep.toString().padStart(1, "0")} / ${totalReps
                      .toString()
                      .padStart(1, "0")}`}
              </Text>
              <Text
                style={{
                  color: isDarkTheme
                    ? theme.darkColors.subtext
                    : theme.lightColors.subtext,
                  alignSelf: "center",
                }}
              >
                {isResting ? "rest" : "reps"}
              </Text>
            </View>
          )}
        </View>

        {!isRunning && (
          <View>
            <TouchableOpacity
              style={{
                width: 90,
                height: 35,
                backgroundColor: theme.colors.blue,
                borderRadius: 25,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => connectHelper()}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: theme.darkColors.text,
                }}
              >
                Connect
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isRunning && (
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              backgroundColor: theme.colors.stop,
              borderRadius: 25,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={stopWorkout}
          >
            <Icon name="stop" color="white" strokeWidth={3} height="20" />
          </TouchableOpacity>
        )}
      </View>
      {!connectionStatus && (
        <View style={styles.connectionStatusContainer}>
          <Icon name="bluetooth" size={36} color={iconColor} />
          <Text style={[styles.connectionText, { color: iconColor }]}>
            Not Connected
          </Text>
        </View>
      )}
    </View>
  );
};

export default TrackView;
