import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "../assets/icons";

export default function Badge({ badge }) {
  return (
    <View style={[styles.badge, { backgroundColor: badge.color + "22" }]}>
      <Icon name={badge.icon} size={20} color={badge.color} fill="transparent" />
      <Text style={[styles.name, { color: badge.color }]}>{badge.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
});
