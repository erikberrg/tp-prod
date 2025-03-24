import React from "react";
import { Pressable } from "react-native";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";
import Icon from "../assets/icons";

export default function RightAction({ dragX, id, onDelete }) {

  const styleAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value + 250 }],
    height: "100%",
    width: 250,
    backgroundColor: "#FF4949",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    color: "#fff",
    padding: 25,
  }));

  return (
    <Pressable onPress={() => onDelete(id)}>
      <Reanimated.View style={[styleAnimation, { height: "100%", width: 70 }]}>
        <Icon name="delete" size={22} color="#fff" />
      </Reanimated.View>
    </Pressable>
  );
}