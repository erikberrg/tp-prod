import { ScrollView, View, useColorScheme, Text, Dimensions } from "react-native";
import React from "react";
import { theme } from "../../constants/theme";
import challenges from "../../helpers/challangeData";
import ProgressiveChallenge from "../../components/ProgressiveChallange";

const ITEM_WIDTH = 250; // Width of each item including any margin/padding

const challanges = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkTheme
          ? theme.darkColors.bg
          : theme.lightColors.bg,
        marginBottom: theme.tabBarHeight,
      }}
    >
      <Text style={{
        fontSize: 24,
        fontWeight: "bold",
        color: isDarkTheme
          ? theme.darkColors.text
          : theme.lightColors.text,
        paddingHorizontal: 20,
        marginTop: 20,
        textAlign: "left",}}>
        Distance
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + 20}
        decelerationRate="fast"
        snapToAlignment="start"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          display: "flex",
          flexDirection: "row",
          gap: 20,
          justifyContent: "flex-start",
        }}
      >
        {challenges.map((challenge, index) => (
          <View
            key={index}
            style={{
              width: ITEM_WIDTH,
            }}
          >
            <ProgressiveChallenge
              challenge={challenge}
              onStart={(pacer) => {
                onStart(pacer);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default challanges;
