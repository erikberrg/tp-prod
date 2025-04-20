import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const challangeScreen = () => {
  const { challenge } = useLocalSearchParams();
  const parsedChallenge = JSON.parse(challenge);
  const router = useRouter();
  const [currentChallenge, setCurrentChallenge] = useState(parsedChallenge);
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  useEffect(() => {
    const loadProgress = async () => {
      const saved = await AsyncStorage.getItem(parsedChallenge.title);
      if (saved) {
        setCurrentChallenge(JSON.parse(saved));
      }
    };
    loadProgress();
  }, []);

  const awardBadge = async (badgeKey) => {
    const earned = await AsyncStorage.getItem("earnedBadges");
    let badges = earned ? JSON.parse(earned) : [];
  
    if (!badges.includes(badgeKey)) {
      badges.push(badgeKey);
      await AsyncStorage.setItem("earnedBadges", JSON.stringify(badges));
      Toast.show({
        type: "success",
        text1: "Badge Unlocked!",
        text2: `You earned the ${badgeKey} badge 🎉`,
      });
    }
  };

  const handleStart = () => {
    setLoading(true);
    buttonWidth.value = 35;

    onStart(pacer); // Pass challenge pacer data

    setTimeout(() => {
      setLoading(false);
      buttonWidth.value = 70;
    }, 4000);
  };

  const markLevelComplete = async (levelIndex) => {
    const updated = { ...parsedChallenge };
    updated.levels[levelIndex].isCompleted = true;
  
    // Unlock next level
    if (updated.levels[levelIndex + 1]) {
      updated.levels[levelIndex + 1].isLocked = false;
    }
  
    // If all levels complete, mark badge earned
    const allDone = updated.levels.every((lvl) => lvl.isCompleted);
    if (allDone) {
      awardBadge(updated.badge); // Your badge key
    }
  
    // Save updated progress
    await AsyncStorage.setItem(updated.title, JSON.stringify(updated));
    router.replace({
      pathname: "/challengeScreen",
      params: { challenge: JSON.stringify(updated) }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          zIndex: 1000,
          top: 20,
          left: 20,
          right: 0,
          bottom: 0,
          backgroundColor: "white",
          borderRadius: 16,
          borderCurve: "continuous",
          display: "flex",
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
        <Text style={styles.gtitle}>{parsedChallenge.title}</Text>
        <View style={styles.icon}>
          <Image
            source={parsedChallenge.image}
            style={{
              width: "100%",
              height: "100%",
            }}
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
          {parsedChallenge.title}
        </Text>
        <View style={styles.actionGroup}>
          {parsedChallenge.levels?.map((level) => (
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
              <View
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Level {level.level} {level.label}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>
                  {level.distance / 1000} km
                </Text>
              </View>
              <TouchableOpacity
                disabled={level.isLocked}
                onPress={() => {
                  handleStart(level);
                }}
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
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name={parsedChallenge.badge} />
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
              {parsedChallenge.badgeText}
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  actionGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    justifyContent: "flex-start",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  gradient: {
    position: "absolute",
    height: 300,
    width: "100%",
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  level: {
    display: "flex",
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

export default challangeScreen;
