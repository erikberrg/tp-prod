import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log('📍 Background location update:', locations);
    // You can store to AsyncStorage or send to server here
  }
});

export async function startBackgroundLocation() {
  const fg = await Location.requestForegroundPermissionsAsync();
  const bg = await Location.requestBackgroundPermissionsAsync();

  if (fg.status !== 'granted' || bg.status !== 'granted') {
    console.warn("Location permissions not granted.");
    return;
  }

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (!hasStarted) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 5,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Track Pacer",
        notificationBody: "Tracking your workout...",
        notificationColor: "#0000ff"
      }
    });
  }
}

export async function stopBackgroundLocation() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
}
