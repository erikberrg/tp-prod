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
            ? theme.darkColors.tabButton
            : theme.lightColors.tabButton,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/challangeScreen",
            params: { challenge: JSON.stringify(challenge) },
          });
        }}
      >
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={[`${challenge.color1}`, `${challenge.color2}`]}
            locations={[0, 1]}
            style={styles.gradient}
          />
          <Text style={styles.gtitle}>{challenge.title2}</Text>
          <View style={styles.icon}>
            <Icon
              name={`${challenge.icon}`}
              size={300}
              color="#ffffff40"
              strokeWidth={1.5}
              fill={"transparent"}
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={{}}>{challenge.title}</Text>
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
            {challenge.description}
          </Text>
          <View style={styles.difficulty}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>{challenge.difficulty}</Text>
          </View>
        </View>
      </TouchableOpacity>
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
    boxShadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject, // cleaner way to cover container
    zIndex: 0, // put behind icon and text
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
    paddingVertical: 15,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
});
