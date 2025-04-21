import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
  Image,
} from "react-native";
import { theme } from "../constants/theme";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import Icon from "../assets/icons";
import { useRouter } from "expo-router";

export default function ProgressiveChallenge({ challenge, onStart }) {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const router = useRouter();

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

    onStart(pacer);

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
          backgroundColor: isDarkTheme
            ? theme.darkColors.bg
            : theme.lightColors.bg,
        },
      ]}
    >
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/(modal)/challengeModal",
            params: { challenge: JSON.stringify(challenge) },
          });
        }}
      >
        <View style={styles.gradientContainer}>
          <Image
            source={challenge.image}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: 16,
            }}
          />
          <Text style={[styles.gtitle, {color: "#fff"}]}>{challenge.title}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text>{challenge.desc2}</Text>
          <Text
            style={[
              styles.description,
              {
                color: isDarkTheme
                  ? theme.lightColors.subtext
                  : theme.darkColors.subtext,
              },
            ]}
          >
            {challenge.desc}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 16,
    gap: 10,
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
  description: {
    fontSize: 14,
    marginTop: 5,
  },
  difficulty: {
    backgroundColor: '#fff',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 5,
    marginTop: 10,
  },
  gradientContainer: {
    position: "relative",
    height: 250,
    width: "100%",
    overflow: "hidden",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject, // cleaner way to cover container
    zIndex: 0, // put behind icon and text
  },

  gtitle: {
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "italic",
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
    paddingVertical: 15,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
});
