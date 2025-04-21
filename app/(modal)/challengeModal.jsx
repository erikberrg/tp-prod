import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleStart, startPacerAnimation } from "../../helpers/handleStart";
import { MODES } from "../../constants/modes";
import { useFocusEffect } from "@react-navigation/native";

const ChallengeModal = () => {
  const { challenge } = useLocalSearchParams();
  const parsedChallenge = JSON.parse(challenge);
  const router = useRouter();
  const [currentChallenge, setCurrentChallenge] = useState(parsedChallenge);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const [mode, setMode] = useState(MODES.BLUETOOTH);

  useEffect(() => {
    AsyncStorage.getItem("runMode").then((saved) => {
      if (saved) setMode(saved);
    });
  }, []);

  const loadProgress = async () => {
    const saved = await AsyncStorage.getItem(parsedChallenge.title);
    if (saved) {
      const updated = JSON.parse(saved);
      console.log("Loaded progress:", updated.levels); // helpful debug
      setCurrentChallenge((prev) => ({
        ...prev,
        levels: updated.levels,
      }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const handleStartPress = async (level) => {
    const pacer = {
      ...level,
      color: currentChallenge.color || "red",
      minutes: currentChallenge.minutes || 0,
      seconds: currentChallenge.seconds || 10,
      challengeTitle: currentChallenge.title,
      levelIndex: level.level - 1,
      badge: currentChallenge.badge, // ✅ Add this!
    };

    console.log("🔍 Parsed Challenge:", parsedChallenge);

    // Save progress to AsyncStorage before starting
    await AsyncStorage.setItem(
      currentChallenge.title,
      JSON.stringify(currentChallenge)
    );

    handleStart({
      pacer,
      mode,
      updatePacerStats: null,
      router,
    });
    await startPacerAnimation(pacer);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          zIndex: 1000,
          top: 20,
          left: 20,
          backgroundColor: "white",
          borderRadius: 16,
          borderCurve: "continuous",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon
          name="arrowLeft"
          size={40}
          color="#000"
          strokeWidth={2}
          fill={"transparent"}
        />
      </TouchableOpacity>

      <View style={styles.gradientContainer}>
        <Text style={styles.gtitle}>{currentChallenge.title}</Text>
        <View style={styles.icon}>
          <Image
            source={currentChallenge.image}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.description,
            {
              color: isDarkTheme
                ? theme.darkColors.text
                : theme.lightColors.text,
            },
          ]}
        >
          {currentChallenge.title}
        </Text>

        <View style={styles.actionGroup}>
          {currentChallenge.levels?.map((level) => (
            <View
              key={level.level}
              style={[
                styles.level,
                {
                  borderColor: isDarkTheme
                    ? theme.darkColors.border
                    : theme.lightColors.border,
                },
              ]}
            >
              <View style={{ flexDirection: "column", gap: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Level {level.level} {level.label}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>
                  {level.distance / 1000} km
                </Text>
              </View>

              <TouchableOpacity
                disabled={level.isLocked}
                onPress={() => handleStartPress(level)}
                style={[
                  level.isLocked && { opacity: 0.5 },
                  {
                    backgroundColor: isDarkTheme
                      ? theme.darkColors.button
                      : theme.lightColors.button,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 18,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isDarkTheme
                      ? theme.darkColors.buttonText
                      : theme.lightColors.buttonText,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Start
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View
            style={{
              marginTop: 5,
              borderWidth: 0.6,
              borderColor: isDarkTheme
                ? theme.darkColors.border
                : theme.lightColors.border,
              padding: 10,
              borderRadius: 20,
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name={currentChallenge.badge} />
            <Text
              style={{
                fontSize: 8,
                fontWeight: "500",
                textTransform: "uppercase",
                color: isDarkTheme
                  ? theme.darkColors.subtext
                  : theme.lightColors.subtext,
              }}
            >
              {currentChallenge.badgeText}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionGroup: {
    flex: 1,
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 24,
    fontWeight: "bold",
  },
  gradientContainer: {
    position: "relative",
    height: 300,
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  gtitle: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 20,
  },
  icon: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
    flexDirection: "column",
    flex: 1,
  },
  level: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.6,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
});

export default ChallengeModal;
