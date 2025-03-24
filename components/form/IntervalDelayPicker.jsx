import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity, Keyboard, useColorScheme } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../constants/theme";
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";

export const IntervalDelayPicker = ({ delay, onChangeDelay }) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const times = Array.from({ length: 60 }, (_, i) => i);
  const [isIntervalPickerVisible, setIsIntervalPickerVisible] = useState(false);
  const toggleVisibility = (setter) => {
    Keyboard.dismiss();
    setter((prev) => !prev);
  };
  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label,{color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text}]}>Interval Time</Text>
        <TouchableOpacity
          onPress={() => toggleVisibility(setIsIntervalPickerVisible)}
          style={[styles.button,{backgroundColor: isDarkTheme ? theme.darkColors.sectionButton : theme.lightColors.sectionButton}]}
        >
        <Text style={[styles.label,{color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text}]}>{delay} sec</Text>
        </TouchableOpacity>
      </View>
      {isIntervalPickerVisible && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.pickerContainer}>
          <Picker
            selectedValue={delay}
            onValueChange={(delay) => onChangeDelay(delay)}
            style={styles.picker}
          >
            {times.map((delay) => (
              <Picker.Item key={delay} label={`${delay} sec`} value={delay} />
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
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  }, 
  label: {
    fontSize: 16,
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
