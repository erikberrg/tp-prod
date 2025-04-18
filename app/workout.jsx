import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import WorkoutMapPreview from "../components/WorkoutMapPreview";
import { useRouter } from "expo-router";
import Icon from "../assets/icons";

const WorkoutScreen = () => {
  const { workout } = useLocalSearchParams();
  const [parsedWorkout, setParsedWorkout] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (workout) {
      try {
        const data = JSON.parse(workout);
        setParsedWorkout(data);
      } catch (err) {
        console.error("Failed to parse workout params:", err);
      }
    }
  }, [workout]);

  if (!parsedWorkout) {
    return null; // or show a loading spinner
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          position: "absolute",
          backgroundColor: "#fff",
          top: 70,
          left: 30,
          zIndex: 5,
          padding: 10,
          borderRadius: 20,
          borderCurve: "continuous",
          shadowColor: "#444",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        }}
        onPress={() => {
          router.back();
        }}
      >
        <Icon name="arrowLeft" size={36} strokeWidth={3} fill={"none"} color={"#000"} />
      </TouchableOpacity>
      <View
        style={{
          position: "absolute",
          top: 70,
          right: 30,
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end',
          backgroundColor: "#fff",
          borderRadius: 24,
          borderCurve: "continuous",
          padding: 10,
          shadowColor: "#444",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            zIndex: 5,
            fontWeight: "700",
          }}
        >
          Distance
        </Text>
        <Text
          style={{
            fontSize: 30,
            zIndex: 5,
            fontWeight: "900",
            fontStyle: "italic",
          }}
        >
          {" "}
          {(parsedWorkout.distance / 1000).toFixed(2)} km
        </Text>
      </View>
      <WorkoutMapPreview path={parsedWorkout.path} />

      <View
        style={{
          position: "absolute",
          bottom: 90,
          right: 30,
          left: 30,
          height: 210,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          paddingHorizontal: 20,
          alignItems: "center",
          borderRadius: 32,
          backgroundColor: "#fff",
          shadowColor: "#444",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: 70,
            borderBottomWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <Text style={{fontWeight: 'bold'}}>Duration</Text>
          <Text>
            {" "}
            {Math.floor(parsedWorkout.time / 60)}m {parsedWorkout.time % 60}s
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: 70,
            borderBottomWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <Text style={{fontWeight: 'bold'}}>Average Pace</Text>
          <Text>Number</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: 70,
          }}
        >
          <Text style={{fontWeight: 'bold'}}>Calories</Text>
          <Text>Number</Text>
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          left: 30,
          height: 50,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 32,
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Share Workout
        </Text>
      </View>
    </View>
  );
};

export default WorkoutScreen;
