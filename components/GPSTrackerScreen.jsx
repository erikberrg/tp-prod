import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function GPSTrackerScreen({ pacer = null, autoStart = false }) {
  const [targetDistance, setTargetDistance] = useState(pacer?.distance ?? 0);
  const [targetTime, setTargetTime] = useState(
    pacer?.minutes * 60 + pacer?.seconds ?? 0
  );
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [distanceRan, setDistanceRan] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const isRunningRef = useRef(false);
  const targetDistanceRef = useRef(targetDistance);
  const locationSub = useRef(null);
  const timerInterval = useRef(null);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  // Sync refs with state
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    targetDistanceRef.current = targetDistance;
  }, [targetDistance]);

  // Get initial location for map display
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

  // Start location updates
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

          if (isRunningRef.current) {
            setPath((prev) => {
              let dist = 0;

              if (prev.length > 0) {
                const last = prev[prev.length - 1];
                dist = getDistance(last, coords);
              }

              setDistanceRan((d) => {
                const newDist = d + dist;
                if (
                  targetDistanceRef.current > 0 &&
                  newDist >= targetDistanceRef.current * 1000
                ) {
                  Toast.show({
                    type: "completeToast",
                    position: "top",
                    topOffset: 100,
                    visibilityTime: 1000,
                    autoHide: true,
                    swipeable: true,
                    text1: "Workout Complete",
                    text2: `${targetDistanceRef.current} km`,
                  });
                  stopWorkout();
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
      console.log("Unmounting GPSTrackerScreen");
      if (locationSub.current) locationSub.current.remove();
    };
  }, []);

  // Auto-start workout if prop set
  useEffect(() => {
    if (autoStart && pacer && pacer.distance) {
      const time = pacer.minutes * 60 + pacer.seconds;
      startWorkout(pacer.distance, time);
    }
  }, [autoStart, pacer]);

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

    // Create workout object
    const workout = {
      id: Date.now(), // unique ID
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
      console.log("Workout saved");

      // 🆕 Update total distance and runs
      const storedRuns = await AsyncStorage.getItem("totalRuns");
      const storedDist = await AsyncStorage.getItem("totalDistance");

      const newRunCount = (parseInt(storedRuns) || 0) + 1;
      const newDistance = (parseInt(storedDist) || 0) + Math.floor(distanceRan);

      await AsyncStorage.setItem("totalRuns", newRunCount.toString());
      await AsyncStorage.setItem("totalDistance", newDistance.toString());
    } catch (err) {
      console.error("Failed to save workout:", err);
    }

    // Reset state
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

  const getAveragePace = () => {
    if (distanceRan === 0) return "0:00";
    const paceInSeconds = timer / (distanceRan / 1000);
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds} min/km`;
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          mapType="terrain"
          showsPointsOfInterest={false}
          pitchEnabled={false}
          showsUserLocation
          followsUserLocation
          region={{
            ...location,
            latitudeDelta: 0.0012,
            longitudeDelta: 0.0012,
          }}
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

      <View
        style={[
          styles.infoBox,
          {
            borderColor: isDarkTheme
              ? theme.darkColors.border
              : theme.lightColors.border,
          },
        ]}
      >
        <BlurView
          intensity={50}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            backgroundColor: isDarkTheme ? "#00000070" : "#ffffff70",
            padding: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <Text
                style={[
                  styles.info,
                  {
                    color: isDarkTheme
                      ? theme.darkColors.text
                      : theme.lightColors.text,
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 0,
                  },
                ]}
              >
                {(distanceRan / 1000).toFixed(2)}
                {targetDistance && targetDistance > 0
                  ? ` / ${(targetDistance / 1000).toFixed(2)} km`
                  : ""}
              </Text>
              <Text
                style={{
                  color: isDarkTheme
                    ? theme.darkColors.subtext
                    : theme.lightColors.subtext,
                }}
              >
                Kilometers
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
                    fontSize: 20,
                    marginBottom: 0,
                  },
                ]}
              >
                {formatTime(timer)}
                {targetTime && targetTime > 0
                  ? ` / ${formatTime(targetTime)}`
                  : ""}
              </Text>
              <Text
                style={{
                  color: isDarkTheme
                    ? theme.darkColors.subtext
                    : theme.lightColors.subtext,
                }}
              >
                Time
              </Text>
            </View>
          </View>

          {!isRunning && (
            <View>
              <Pressable
                style={{
                  width: 100,
                  height: 45,
                  backgroundColor: theme.colors.blue,
                  borderRadius: 25,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => startWorkout()}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 14,
                    color: theme.darkColors.text,
                  }}
                >
                  Quick Start
                </Text>
              </Pressable>
            </View>
          )}

          {isRunning && (
            <Pressable
              style={{
                width: 50,
                height: 50,
                backgroundColor: theme.colors.stop,
                borderRadius: 25,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={stopWorkout}
            >
              <Icon name="stop" color="white" strokeWidth={3} />
            </Pressable>
          )}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
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
    borderWidth: 1,
  },
  info: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: "left",
  },
});
