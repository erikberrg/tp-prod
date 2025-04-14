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
  interpolate,
  Easing,
} from "react-native-reanimated";

export default function PacerItem({ pacer, onStart, onDelete, editMode }) {
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

  // Animations
  const slideOffset = useSharedValue(editMode ? -36 : 0);
  const deleteOpacity = useSharedValue(editMode ? 1 : 0);
  const buttonWidth = useSharedValue(70);

  useEffect(() => {
    slideOffset.value = withTiming(editMode ? -36 : 0, { duration: 200 });
    deleteOpacity.value = withTiming(editMode ? 1 : 0, { duration: 300 });
  }, [editMode]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideOffset.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: deleteOpacity.value,
    transform: [
      {
        scale: interpolate(deleteOpacity.value, [0, 1], [0.6, 1]),
      },
    ],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    width: withTiming(buttonWidth.value, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    }),
  }));

  const handleStart = () => {
    setTimeout(() => {
      setLoading(true);
      buttonWidth.value = 35;
    }, 50);

    onStart();

    setTimeout(() => {
      setLoading(false);
      buttonWidth.value = 70;
    }, 4000);
  };

  return (
    <View style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <View style={styles.pacerItem}>
        <Animated.View style={[styles.pacerItemRow, slideStyle]}>
          <View style={styles.infoContainer}>
            <View
              style={[
                styles.color,
                {
                  backgroundColor: pacer.color,
                  boxShadow: `0px 2px 20px ${pacer.color}40`,
                },
              ]}
            />
            <View style={{ gap: 4 }}>
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

          <View style={styles.actionGroup}>
            <Animated.View
              style={[
                {
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isDarkTheme
                    ? theme.darkColors.button
                    : theme.lightColors.button,
                  borderWidth: 0.5,
                  borderColor: isDarkTheme
                    ? theme.darkColors.border
                    : theme.lightColors.border,
                  borderRadius: theme.radius.xl,
                  overflow: "hidden",
                },
                animatedButtonStyle,
              ]}
            >
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
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 14,
                      color: isDarkTheme
                        ? theme.darkColors.buttonText
                        : theme.lightColors.buttonText,
                    }}
                  >
                    Start
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>

            <Animated.View
              style={[
                styles.deleteButtonWrapper,
                { position: "absolute", left: 76 },
                deleteButtonStyle,
              ]}
            >
              <TouchableOpacity
                onPress={() => onDelete(pacer.id)}
                disabled={!editMode}
                style={{
                  height: 35,
                  width: 35,
                  backgroundColor: isDarkTheme
                    ? theme.darkColors.tabButton
                    : theme.lightColors.tabButton,
                  borderWidth: 0.5,
                  borderColor: isDarkTheme
                    ? theme.darkColors.border
                    : theme.lightColors.border,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 18,
                  marginLeft: 8,
                }}
              >
                <Icon
                  name="delete"
                  size={16}
                  color={iconColor}
                  fill={iconColor}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  pacerItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  pacerItemRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  color: { height: 50, width: 50, borderRadius: 25 },
  infoTitle: { fontSize: 16, fontWeight: "bold" },
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 70,
    height: 35,
  },
  deleteButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
