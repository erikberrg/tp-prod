import { ScrollView, View, useColorScheme } from "react-native";
import React from "react";
import { theme } from "../../constants/theme";
import WeeklyPacer from "../../components/WeeklyPacer";
import challenges from "../../helpers/challangeData"; // adjust path if needed
import ProgressiveChallenge from "../../components/ProgressiveChallange";


const challanges = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  return (
    <View style={{ flex: 1, backgroundColor: isDarkTheme ? theme.darkColors.bg : theme.lightColors.bg }}>
    <ScrollView
      contentContainerStyle={{
        backgroundColor: isDarkTheme
          ? theme.darkColors.bg
          : theme.lightColors.bg,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "90%",
          height: 120,
          borderRadius: 18,
          borderWidth: 0.6,
          borderColor: isDarkTheme
            ? theme.darkColors.border
            : theme.lightColors.border,
          display: "flex",
          flexDirection: "row",
          backgroundColor: isDarkTheme
            ? theme.darkColors.tabButton
            : theme.lightColors.tabButton,
          marginVertical: 10,
        }}
      >
        <WeeklyPacer
          onStart={(pacer) => {
            onStart(pacer);
          }}
        />
      </View>
      {challenges.map((challenge, index) => (
        <ProgressiveChallenge
          key={index}
          challenge={challenge}
          onStart={(pacer) => {
            onStart(pacer);
          }}
        />
      ))}
    </ScrollView>
    </View>
  );
};

export default challanges;
