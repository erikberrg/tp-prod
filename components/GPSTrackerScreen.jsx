import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
  TouchableOpacity
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import LinearGradient from "react-native-linear-gradient";
import * as Haptics from 'expo-haptics';
import { transform } from "typescript";

export default function GPSTrackerScreen({ pacer = null, autoStart = false }) {
  const [targetDistance, setTargetDistance] = useState(
    Number(pacer?.distance ?? 0)
  );
  const [targetTime, setTargetTime] = useState(
    pacer?.minutes * 60 + pacer?.seconds ?? 0
  );
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [distanceRan, setDistanceRan] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);

  const isRunningRef = useRef(false);
  const targetDistanceRef = useRef(targetDistance);
  const locationSub = useRef(null);
  const timerInterval = useRef(null);
  const mapRef = useRef(null);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    targetDistanceRef.current = targetDistance;
  }, [targetDistance]);

  useEffect(() => {
    if (shouldStop) {
      setShouldStop(false); // reset flag
      stopWorkout();
      completeChallenge(pacer);
    }
  }, [shouldStop]);

  useEffect(() => {
    const getInitialLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const current = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    };

    getInitialLocation();
  }, []);

  useEffect(() => {
    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      locationSub.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          setLocation(coords);

          if (mapRef.current) {
            mapRef.current.animateToRegion(
              {
                ...coords,
                latitudeDelta: 0.0012,
                longitudeDelta: 0.0012,
              },
              600
            );
          }

          if (isRunningRef.current) {
            setPath((prev) => {
              let dist = 0;

              if (prev.length > 0) {
                const last = prev[prev.length - 1];
                dist = getDistance(last, coords);
              }

              coords.timestamp = Date.now();

              setDistanceRan((d) => {
                const newDist = d + dist;

                const hasReachedTarget =
                  targetDistanceRef.current &&
                  newDist >= targetDistanceRef.current;

                if (hasReachedTarget) {
                  setShouldStop(true);
                }
                return newDist;
              });

              return [...prev, coords];
            });
          }
        }
      );
    };

    startLocationUpdates();

    return () => {
      if (locationSub.current) locationSub.current.remove();
    };
  }, []);

  useEffect(() => {
    if (autoStart && pacer && pacer.distance) {
      const time = pacer.minutes * 60 + pacer.seconds;
      startWorkout(pacer.distance, time);
    }
  }, [autoStart, pacer]);

  const completeChallenge = async (pacer) => {
    try {
      const stored = await AsyncStorage.getItem("completedBadges");
      const completed = stored ? JSON.parse(stored) : [];

      if (!completed.includes(pacer.id)) {
        completed.push(pacer.id);
        await AsyncStorage.setItem(
          "completedBadges",
          JSON.stringify(completed)
        );
      }
    } catch (err) {
      console.error("Error saving completed badge:", err);
    }
  };

  const startWorkout = (distance = 0, time = 0) => {
    if (timerInterval.current) clearInterval(timerInterval.current);

    setDistanceRan(0);
    setTimer(0);
    setPath([]);
    targetDistanceRef.current = distance;

    setTargetDistance(distance);
    setTargetTime(time);

    const startTime = Date.now();
    timerInterval.current = setInterval(() => {
      const time = Math.floor((Date.now() - startTime) / 1000);
      setTimer(time);
    }, 1000);

    setIsRunning(true);
  };

  const stopWorkout = async () => {
    setIsRunning(false);

    const workout = {
      id: Date.now(),
      distance: distanceRan,
      time: timer,
      path,
      date: new Date().toISOString(),
    };

    try {
      const existingData = await AsyncStorage.getItem("workoutHistory");
      const workouts = existingData ? JSON.parse(existingData) : [];
      workouts.unshift(workout);
      await AsyncStorage.setItem("workoutHistory", JSON.stringify(workouts));

      Toast.show({
        type: "completeToast",
        position: "top",
        topOffset: 120,
        visibilityTime: 5000,
        autoHide: true,
        swipeable: true,
        text1: "Workout Saved 🎉",
        text2: `${(distanceRan / 1000).toFixed(2)} km in ${formatTime(timer)}`,
      });

      const storedRuns = await AsyncStorage.getItem("totalRuns");
      const storedDist = await AsyncStorage.getItem("totalDistance");

      const newRunCount = (parseInt(storedRuns) || 0) + 1;
      const newDistance = (parseInt(storedDist) || 0) + Math.floor(distanceRan);

      await AsyncStorage.setItem("totalRuns", newRunCount.toString());
      await AsyncStorage.setItem("totalDistance", newDistance.toString());
    } catch (err) {
      console.error("Failed to save workout:", err);
    }

    setDistanceRan(0);
    setTimer(0);
    setTargetDistance(0);
    setTargetTime(0);
    setPath([]);

    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${("0" + (sec % 60)).slice(-2)}`;

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 150, // same as gradient
          zIndex: 999,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,1)",
            "rgba(255,255,255,1)",
          ]}
          locations={[0, 0.4, 1]}
          style={styles.gradient}
        />
      </View>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          mapType="terrain"
          showsPointsOfInterest={false}
          pitchEnabled={false}
          showsUserLocation
          followsUserLocation
        >
          {path.length > 0 && (
            <Polyline
              coordinates={path}
              strokeWidth={12}
              strokeColor="#007AFF"
            />
          )}
        </MapView>
      )}

      <View style={styles.infoBox}>
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: isDarkTheme
              ? theme.darkColors.bg
              : theme.lightColors.bg,
            padding: 14,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
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
                {targetDistance
                  ? (Math.max(targetDistance - distanceRan, 0) / 1000).toFixed(
                      2
                    )
                  : (distanceRan / 1000).toFixed(2)}
              </Text>
              <Text
                style={{
                  color: isDarkTheme
                    ? theme.darkColors.subtext
                    : theme.lightColors.subtext,
                }}
              >
                km
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
                {formatTime(timer)}
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

          {!isRunning && (
            <View>
              <TouchableOpacity
                style={{
                  width: 90,
                  height: 40,
                  backgroundColor: theme.colors.blue,
                  borderRadius: 25,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => startWorkout()}
                onPressIn={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                onPressOut={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 12,
                    color: theme.darkColors.text,
                  }}
                >
                  Quick Start
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isRunning && (
            <TouchableOpacity
              style={{
                width: 40,
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
                  topOffset: 110,
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
                stopWorkout();
              }}
            >
              <Icon name="stop" color="white" strokeWidth={3} height={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  infoBox: {
    position: "absolute",
    zIndex: 1000,
    bottom: 90,
    left: 10,
    right: 10,
    borderRadius: 20,
    shadowColor: "rgba(0,0,0)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    boxShadow: "0px 0px 0px 0px",
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
    textAlign: "left",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150, // Make this taller just to be sure it's not hidden
    zIndex: 1000, // Force it above other content
    pointerEvents: "none",
  },
});
