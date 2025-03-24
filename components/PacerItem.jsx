import React, { useState } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Button from "../components/ui/Button";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Divider from "../components/ui/Divider";
import RightAction from "../components/RightAction";
import Loading from "../components/ui/Loading";

export default function PacerItem({ pacer, onStart, onDelete }) {
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

  return (
    <View style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <ReanimatedSwipeable
        renderRightActions={(progress, dragX) => (
          <RightAction dragX={dragX} id={pacer.id} onDelete={onDelete} />
        )}
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={30}
        rightThreshold={40}
        overshootRight={true}
      >
        <View style={styles.pacerItem}>
          <View style={styles.buttonContainer}>
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
          <View style={styles.buttonContainer}>
            {loading ? (
              <View
                style={{
                  height: 35,
                  width: 70,
                  backgroundColor: isDarkTheme
                    ? theme.darkColors.button
                    : theme.lightColors.button,
                  borderWidth: 0.5,
                  borderColor: isDarkTheme
                    ? theme.darkColors.border
                    : theme.lightColors.border,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: theme.radius.xl,}}
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
                    ? theme.darkColors.button
                    : theme.lightColors.button,
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
          </View>
        </View>
      </ReanimatedSwipeable>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  pacerItem: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
  },
  separator: {
    width: "100%",
    borderTopWidth: 1,
    borderColor: "#000",
  },
});
