// Home screen with track
import React from "react";
import TrackView from "../../components/TrackView";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";


const index = () => {
  const { pacer } = useLocalSearchParams();
  const parsedPacer = pacer ? JSON.parse(pacer) : null;

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <TrackView pacer={parsedPacer} autoStart={true} />
    </>
  );
};

export default index;
