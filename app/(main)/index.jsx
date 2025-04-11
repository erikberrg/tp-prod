// Home screen with track

import React from "react";
import TrackView from "../../components/TrackView";
import { StatusBar } from "expo-status-bar";

const index = () => {
  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <TrackView />
    </>
  );
};

export default index;
