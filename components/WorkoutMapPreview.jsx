import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Polyline } from "react-native-maps";

export default function WorkoutMapPreview({ path }) {
  if (!path || path.length < 2) return null;

  const latitudes = path.map((p) => p.latitude);
  const longitudes = path.map((p) => p.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;

  const latDelta = (maxLat - minLat) * 1.5 || 0.002;
  const lngDelta = (maxLng - minLng) * 1.5 || 0.002;

  return (
    <View style={styles.container}>
      <MapView
        mapType="standard"
        showsPointsOfInterest={false}
        style={styles.map}
        pointerEvents="none"
        zoomEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        pitchEnabled={false}
        initialRegion={{
          latitude: midLat,
          longitude: midLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        }}
      >
        {path && path.length > 0 && (
          <Polyline coordinates={path} strokeColor="#007AFF" strokeWidth={4} />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    overflow: "hidden",
  },
  map: {
    flex: 1,
    marginTop: -200,
  },
});
