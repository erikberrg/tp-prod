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
        NSBluetoothAlwaysUsageDescription: "We need Bluetooth access to connect to your devices.",
       }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#000000"
      },
      package: "com.erikdberg.tpprod",
      permissions: [
        "BLUETOOTH",
        "BLUETOOTH_ADMIN",
        "BLUETOOTH_SCAN",
        "BLUETOOTH_CONNECT"
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
          imageWidth: 400,
          resizeMode: "contain",
          backgroundColor: "#000000"
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
    }
  }
};
