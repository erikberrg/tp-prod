import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import Button from "../components/ui/Button";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";
import Divider from "../components/ui/Divider";
import Loading from "../components/ui/Loading";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
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

  const slideOffset = useSharedValue(editMode ? -36 : 0);
  const deleteOpacity = useSharedValue(editMode ? 1 : 0);

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
            {loading ? (
              <View
                style={{
                  height: 35,
                  width: 70,
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
                }}
              >
                <Loading />
              </View>
            ) : (
              <Button
                title="Start"
                hasShadow={false}
                textStyle={[
                  { fontWeight: "bold", fontSize: 14 },
                  isDarkTheme
                    ? { color: theme.darkColors.buttonText }
                    : { color: theme.lightColors.buttonText },
                ]}
                buttonStyle={{
                  height: 35,
                  width: 70,
                  backgroundColor: isDarkTheme
                    ? theme.darkColors.tabButton
                    : theme.lightColors.tabButton,
                  borderWidth: 0.5,
                  borderColor: isDarkTheme
                    ? theme.darkColors.border
                    : theme.lightColors.border,
                }}
                onPress={() => {
                  onStart();
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                  }, 4000);
                }}
              />
            )}

            <Animated.View
              style={[
                styles.deleteButtonWrapper,
                {
                  position: "absolute",
                  left: 76,
                },
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
    justifyContent: "flex-end",
    position: "relative",
    width: 70,
    height: 35,
  },
  deleteButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
