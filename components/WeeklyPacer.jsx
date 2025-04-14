import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import Icon from "../assets/icons";
import Divider from "../components/ui/Divider";
import Loading from "../components/ui/Loading";
import { theme } from "../constants/theme";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import challengeData from "../helpers/weeklyPacer.json"; // or fetch from URL

export default function WeeklyPacer({ onStart }) {
  const [pacer, setPacer] = useState(null);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const iconColor = isDarkTheme
    ? theme.darkColors.icon
    : theme.lightColors.icon;
  const textColor = isDarkTheme
    ? theme.darkColors.text
    : theme.lightColors.text;
  const subTextColor = isDarkTheme
    ? theme.darkColors.subtext
    : theme.lightColors.subtext;

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

  useEffect(() => {
    const getStartOfWeek = (date) => {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    };

    const todayStart = getStartOfWeek(new Date()).toDateString();

    const matchingChallenge = challengeData.find((challenge) => {
      const challengeStart = getStartOfWeek(
        new Date(challenge.week)
      ).toDateString();
      return challengeStart === todayStart;
    });

    if (matchingChallenge) {
      setPacer(matchingChallenge);
    } else {
      setPacer(null);
    }
  }, []);

  return (
    <>
      {pacer ? (
        <View style={{ width: "100%" }}>
          <View style={styles.pacerItem}>
            <View style={styles.infoContainer}>
              <View
                style={[
                  styles.color,
                  {
                    backgroundColor: pacer.color,
                    boxShadow: `0px 2px 20px ${pacer.color}40`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Icon
                  name="trophy"
                  size={28}
                  strokeWidth={2}
                  color={isDarkTheme ? theme.darkColors.tabButton : theme.lightColors.tabButton}
                  fill="transparent"
                />
              </View>
              <View style={{ gap: 4 }}>
                <Text
                  style={[
                    styles.infoText,
                    { color: subTextColor, fontSize: 10 },
                  ]}
                >
                  Weekly Challange
                </Text>
                <Text style={[styles.infoTitle, { color: textColor }]}>
                  {pacer.name}
                </Text>
                <View style={styles.infoWrapper}>
                  <Icon name="shoe" size={18} color={iconColor} />
                  <Text style={[styles.infoText, { color: subTextColor }]}>
                    {pacer.distance} Meters
                  </Text>
                </View>
                <View style={styles.infoWrapper}>
                  <Icon name="timer" size={18} color={iconColor} />
                  <Text style={[styles.infoText, { color: subTextColor }]}>
                    {pacer.minutes} min {pacer.seconds} sec
                  </Text>
                </View>
                <View style={styles.infoWrapper}>
                  <Icon name="repeat" size={18} color={iconColor} />
                  <Text style={[styles.infoText, { color: subTextColor }]}>
                    {pacer.repetitions}
                  </Text>
                  <Icon name="pause" size={18} color={iconColor} />
                  <Text style={[styles.infoText, { color: subTextColor }]}>
                    {pacer.delay}
                  </Text>
                </View>
              </View>
            </View>
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
        </View>
      ) : (
        <View style={{ padding: 20 }}>
          <Text style={{ color: textColor, fontSize: 18, textAlign: "center" }}>
            No Weekly Pacer Challenge Available
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  pacerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: "100%",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  color: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    fontWeight: theme.fonts.light,
  },
  infoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionGroup: {
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
