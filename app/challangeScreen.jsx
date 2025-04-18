import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "../assets/icons";

const challangeScreen = () => {
  const { challenge } = useLocalSearchParams();
  const parsedChallenge = JSON.parse(challenge);
  const router = useRouter();

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
        <LinearGradient
          colors={[`${parsedChallenge.color1}`, `${parsedChallenge.color2}`]}
          locations={[0, 1]}
          style={styles.gradient}
          sharedTransitionTag="tag"
        />
        <Text style={styles.gtitle}>{parsedChallenge.title2}</Text>
        <View style={styles.icon}>
          <Icon
            name={`${parsedChallenge.icon}`}
            size={200}
            color="#ffffffa0"
            strokeWidth={2}
            fill={"transparent"}
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.actionGroup}>
          <Text style={styles.level}>Level 1</Text>
          <Text style={styles.level}>Level 2</Text>
          <Text style={styles.level}>Level 3</Text>
          <Text style={styles.level}>Level 4</Text>
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
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginVertical: 10,
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
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    flex: 1,
  },
  level: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 10,
    paddingVertical: 20,
    borderRadius: 12,
    width: "100%",
    textAlign: "center",
  },
});

export default challangeScreen;
