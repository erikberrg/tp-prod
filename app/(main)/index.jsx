// Home screen with track

import React, { useState, useEffect, useCallback } from "react";
import TrackView from "../../components/TrackView";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GPSTrackerScreen from "../../components/GPSTrackerScreen"; // update path if needed
import { MODES } from "../../constants/modes"; // assuming you have this
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const index = () => {
  const { pacer } = useLocalSearchParams();
  const [mode, setMode] = useState(null); // null = loading

  useFocusEffect(
    useCallback(() => {
      const loadMode = async () => {
        const savedMode = await AsyncStorage.getItem("runMode");
        setMode(savedMode || MODES.BLUETOOTH); // fallback
      };
      loadMode();
    }, [])
  );

  if (mode === null) return null; // loading state
  const parsedPacer = pacer ? JSON.parse(pacer) : null;

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      {mode === MODES.GPS ? (
        <GPSTrackerScreen pacer={parsedPacer} autoStart={true} />
      ) : (
        <TrackView />
      )}
    </>
  );
};

export default index;
