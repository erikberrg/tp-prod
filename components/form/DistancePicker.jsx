import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  useColorScheme,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../constants/theme";
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";

export const DistancePicker = ({ selectedDistance, onSelectDistance }) => {
    const colorScheme = useColorScheme();
    const isDarkTheme = colorScheme === "dark";
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const distances = [
    "200",
    "400",
    "800",
    "1600",
    "3200",
    "5000",
    "8000",
    "10000",
  ];

  const toggleVisibility = (setter) => {
    Keyboard.dismiss();
    setter((prev) => !prev);
  };
  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label,{color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text}]}>Distance</Text>
        <TouchableOpacity
          onPress={() => toggleVisibility(setIsPickerVisible)}
          style={[styles.button,{backgroundColor: isDarkTheme ? theme.darkColors.sectionButton : theme.lightColors.sectionButton}]}
        >
        <Text style={[styles.label,{color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text}]}>{selectedDistance} Meters</Text>
        </TouchableOpacity>
      </View>
      {isPickerVisible && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDistance}
            onValueChange={onSelectDistance}
            style={styles.picker}
          >
            {distances.map((distance) => (
              <Picker.Item
                key={distance}
                label={`${distance} Meters`}
                value={distance}
              />
            ))}
          </Picker>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    width: "100%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 17,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pickerContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
});
