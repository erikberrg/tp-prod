// Track View

import bleHelper from "../helpers/ble";
import Icon from "../assets/icons";
import LottieView from "lottie-react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Animated, StyleSheet, View, useColorScheme, Text } from "react-native";
import { useAnimationContext } from "./AnimationContext";
import { theme } from "../constants/theme";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24
  },
  connectionStatusContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  connectionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

const TrackView = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const iconColor = isDarkTheme ? theme.darkColors.track : theme.lightColors.track;
  const { animationColor, animationProgress } = useAnimationContext();
  const [connectionStatus, setConnectionStatus] = useState(false);

  const checkConnectionStatus = useCallback(() => {
    setConnectionStatus(bleHelper.getConnectionStatus());
  }, []);

  useEffect(() => {
    checkConnectionStatus();
    const interval = setInterval(checkConnectionStatus, 1000);
    return () => clearInterval(interval);
  }, [checkConnectionStatus]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? theme.darkColors.bg : theme.lightColors.bg },
      ]}
    >
      <AnimatedLottieView
        style={{ width: "100%", height: "100%" }}
        source={require("../assets/images/track.json")}
        progress={animationProgress.current}
        colorFilters={[
          {
            keypath: "Marker",
            color: animationColor,
          },
          {
            keypath: "Track",
            color: isDarkTheme ? theme.darkColors.track : theme.lightColors.track,
          },
        ]}
      />
      {!connectionStatus && (
        <View style={styles.connectionStatusContainer}>
          <Icon name="bluetooth" size={36} color={iconColor} />
          <Text style={[styles.connectionText, { color: iconColor }]}>
            Not Connected
          </Text>
        </View>
      )}
    </View>
  );
};

export default TrackView;
