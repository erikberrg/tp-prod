import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { theme } from "../constants/theme";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
  } from "react-native-reanimated";
import Loading from "../components/ui/Loading";

export default function ProgressiveChallenge({ challenge, onStart }) {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  const [loading, setLoading] = useState(false);
  const buttonWidth = useSharedValue(70);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    width: withTiming(buttonWidth.value, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    }),
  }));

  const handleStart = () => {
    setLoading(true);
    buttonWidth.value = 35;

    onStart(pacer); // Pass challenge pacer data

    setTimeout(() => {
      setLoading(false);
      buttonWidth.value = 70;
    }, 4000);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isDarkTheme
            ? theme.darkColors.border
            : theme.lightColors.border,
          backgroundColor: isDarkTheme
            ? theme.darkColors.tabButton
            : theme.lightColors.tabButton,
        },
      ]}
    >
      <View
        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}
      >
        <Text style={[styles.title, { color: challenge.color }]}>
          {challenge.title}
        </Text>
        <Animated.View style={[styles.actionGroup, animatedButtonStyle]}>
              {loading ? (
                <Loading />
              ) : (
                <TouchableOpacity
                  onPress={handleStart}
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isDarkTheme
                      ? theme.lightColors.bg
                      : theme.darkColors.bg,
                    borderRadius: theme.radius.xl,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 14,
                      color: isDarkTheme
                        ? theme.lightColors.text
                        : theme.darkColors.text,
                    }}
                  >
                    Start
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
      </View>
      {challenge.levels.map((level, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.levelCard,
            {
              backgroundColor: isDarkTheme
                ? theme.darkColors.section
                : theme.lightColors.bg,
            },
          ]}
          onPress={() => onStart(level)}
        >
          <Text
            style={[
              styles.levelTitle,
              {
                color: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
              },
            ]}
          >
            {level.title}
          </Text>
          <Text
            style={[
              styles.levelDetails,
              {
                color: isDarkTheme
                  ? theme.darkColors.subtext
                  : theme.lightColors.subtext,
              },
            ]}
          >
            {level.distance} km • {level.minutes}:
            {level.seconds.toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginVertical: 12,
    padding: 10,
    borderRadius: 16,
    borderWidth: 0.6,
    display: "flex",
    flexDirection: "column",
  },
  actionGroup: {
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  levelCard: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  levelDetails: {
    fontSize: 14,
  },
});
