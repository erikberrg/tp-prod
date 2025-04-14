import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { theme } from "../../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Badge from "../../components/Badge";
import challengeData from "../../helpers/weeklyPacer.json";
import WorkoutMapPreview from "../../components/WorkoutMapPreview";
import Icon from "../../assets/icons";

export default function profile() {
  const [name, setName] = useState("Set Name");
  const [totalRuns, setTotalRuns] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [completedBadges, setCompletedBadges] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) setName(storedName);

        const storedBadges = await AsyncStorage.getItem("completedBadges");
        const completedIds = storedBadges ? JSON.parse(storedBadges) : [];

        const filteredBadges = challengeData.filter((c) =>
          completedIds.includes(c.id)
        );
        setCompletedBadges(filteredBadges);
      };

      loadProfile();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const loadStats = async () => {
        const runs = await AsyncStorage.getItem("totalRuns");
        const dist = await AsyncStorage.getItem("totalDistance");
        setTotalRuns(parseInt(runs) || 0);
        setTotalDistance(parseInt(dist) || 0);
      };
      loadStats();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const loadWorkouts = async () => {
        try {
          const data = await AsyncStorage.getItem("workoutHistory");
          if (data) setWorkoutHistory(JSON.parse(data));
        } catch (err) {
          console.error("Failed to load workouts:", err);
        }
      };
      loadWorkouts();
    }, [])
  );

  const resetProfile = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userName",
        "completedBadges",
        "totalRuns",
        "totalDistance",
        "workoutHistory",
      ]);
      setName("Set Name");
      setCompletedBadges([]);
      setTotalRuns(0);
      setTotalDistance(0);
      setWorkoutHistory([]);
      console.log("Profile reset!");
    } catch (err) {
      console.error("Error resetting profile:", err);
    }
  };

  const deleteWorkout = async (id) => {
    try {
      const data = await AsyncStorage.getItem("workoutHistory");
      if (!data) return;

      const workouts = JSON.parse(data);
      const filtered = workouts.filter((w) => w.id !== id);

      await AsyncStorage.setItem("workoutHistory", JSON.stringify(filtered));
      setWorkoutHistory(filtered);

      // Optional: update total distance and runs
      const deletedWorkout = workouts.find((w) => w.id === id);
      if (deletedWorkout) {
        const updatedRuns = Math.max(totalRuns - 1, 0);
        const updatedDistance = Math.max(
          totalDistance - deletedWorkout.distance,
          0
        );

        await AsyncStorage.setItem("totalRuns", updatedRuns.toString());
        await AsyncStorage.setItem("totalDistance", updatedDistance.toString());

        setTotalRuns(updatedRuns);
        setTotalDistance(updatedDistance);
      }
    } catch (err) {
      console.error("Failed to delete workout:", err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkTheme
          ? theme.darkColors.bg
          : theme.lightColors.bg,
      }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: isDarkTheme
              ? theme.darkColors.bg
              : theme.lightColors.bg,
          },
        ]}
      >
        {/* Username Input */}
        <View
          style={[
            styles.section,
            { display: "flex", justifyContent: "center", alignItems: "center" },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkTheme
                  ? theme.darkColors.input
                  : theme.lightColors.input,
                color: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
              },
            ]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              AsyncStorage.setItem("userName", text);
            }}
            placeholder="Set Name"
            placeholderTextColor={
              isDarkTheme ? theme.darkColors.subtext : theme.lightColors.subtext
            }
          />
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              {
                color: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
              },
            ]}
          >
            Badges
          </Text>
          {completedBadges.length > 0 ? (
            <View style={styles.badgeGrid}>
              {completedBadges.map((badge) => (
                <Badge key={badge.id} badge={badge} />
              ))}
            </View>
          ) : (
            <Text
              style={{
                color: isDarkTheme
                  ? theme.darkColors.subtext
                  : theme.lightColors.subtext,
              }}
            >
              No badges yet! Start your first challenge.
            </Text>
          )}
        </View>

        {/* Run Stats */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              {
                color: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
              },
            ]}
          >
            Total Runs
          </Text>
          <Text
            style={[
              styles.stat,
              {
                color: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
              },
            ]}
          >
            {totalRuns}
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              {
                color: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
              },
            ]}
          >
            Total Distance
          </Text>
          <Text
            style={[
              styles.stat,
              {
                color: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
              },
            ]}
          >
            {(totalDistance / 1000).toFixed(2)} Kilometers
          </Text>
        </View>

        {/* Previous Workouts */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              {
                color: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
              },
            ]}
          >
            Previous Workouts
          </Text>
          {workoutHistory.length > 0 ? (
            workoutHistory.map((workout) => (
              <View
                key={workout.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 12,
                  backgroundColor: isDarkTheme
                    ? theme.darkColors.tabButton
                    : theme.lightColors.tabButton,
                  borderRadius: 10,
                  borderWidth: 0.6,
                  borderColor: isDarkTheme
                    ? theme.darkColors.border
                    : theme.lightColors.border,
                }}
              >
                <View
                  style={{ display: "flex", flexDirection: "column", margin: 12 }}
                >
                  <Text
                    style={{
                      color: isDarkTheme
                        ? theme.darkColors.subtext
                        : theme.lightColors.subtext,
                    }}
                  >
                    {new Date(workout.date).toLocaleString()}
                  </Text>
                </View>
                <WorkoutMapPreview path={workout.path} />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    margin: 12,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 12 }}>
                  <Text
                    style={{
                      color: isDarkTheme
                        ? theme.darkColors.text
                        : theme.lightColors.text,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {(workout.distance / 1000).toFixed(2)}km
                  </Text>
                  <Text
                    style={{
                      color: isDarkTheme
                        ? theme.darkColors.text
                        : theme.lightColors.text,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {Math.floor(workout.time / 60)}m {workout.time % 60}s
                  </Text>
                  </View>
                  <TouchableOpacity
                  onPress={() => deleteWorkout(workout.id)}
                  style={{
                    marginTop: 0,
                    alignSelf: "flex-start",
                    backgroundColor: "#ff4d4d",
                    paddingVertical: 4,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                  }}
                >
                  <Icon name="delete" color="white" fill="white" width="16" height="16"/>
                </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text
              style={{
                color: isDarkTheme
                  ? theme.darkColors.subtext
                  : theme.lightColors.subtext,
              }}
            >
              No workouts recorded yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  section: {
    gap: 12,
    width: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 32,
    fontWeight: "bold",
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  stat: {
    fontSize: 16,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: "#ff4d4d",
    padding: 12,
    borderRadius: 10,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
