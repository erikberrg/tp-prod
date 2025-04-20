import 'dotenv/config';

export default {
  expo: {
    name: "tp-prod",
    slug: "tp-prod",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      jsEngine: "jsc",
      bundleIdentifier: "com.erikdberg.tpprod",
      infoPlist: {
        CFBundleDisplayName: "Track Pacer",
        NSLocationWhenInUseUsageDescription: "We need your location to track your workout.",
        NSLocationAlwaysUsageDescription: "We need your location in the background to track your run.",
        UIBackgroundModes: ["location"]
       }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.erikdberg.tpprod",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE"
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "27471cd5-5108-4959-8cfc-cf36e29d662a"
      },
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    }
  }
};
