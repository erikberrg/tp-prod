import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import PacerItem from "./PacerItem";

export default function PacerList({ pacers, onStart, onDelete }) {
  return (
    <ScrollView>
      <View style={styles.pacerList}>
        {pacers.map((pacer) => (
          <PacerItem
            key={String(pacer.id)}
            pacer={pacer}
            onStart={() => {
              onStart(pacer)
            }}
            onDelete={() => {
              onDelete(pacer.id);
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pacerList: {
    marginTop: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
