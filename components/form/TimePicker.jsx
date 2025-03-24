import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity, Keyboard, useColorScheme } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../constants/theme";
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";

export const TimePicker = ({ minutes, seconds, onChangeTime }) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const times = Array.from({ length: 60 }, (_, i) => i);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const toggleVisibility = (setter) => {
    Keyboard.dismiss();
    setter((prev) => !prev);
  };
  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label,{color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text}]}>Time</Text>
        <TouchableOpacity
          onPress={() => toggleVisibility(setIsTimePickerVisible)}
          style={[styles.button,{backgroundColor: isDarkTheme ? theme.darkColors.sectionButton : theme.lightColors.sectionButton}]}
        >
        <Text style={[styles.label,{color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text}]}>{minutes} min {seconds} sec</Text>
        </TouchableOpacity>
      </View>
      {isTimePickerVisible && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.pickerContainer}>
          <Picker
            selectedValue={minutes}
            onValueChange={(min) => onChangeTime(min, seconds)}
            style={styles.picker}
          >
            {times.map((time) => (
              <Picker.Item key={time} label={`${time} min`} value={time} />
            ))}
          </Picker>
          <Picker
            selectedValue={seconds}
            onValueChange={(sec) => onChangeTime(minutes, sec)}
            style={styles.picker}
          >
            {times.map((time) => (
              <Picker.Item key={time} label={`${time} sec`} value={time} />
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
    width: "49%",
    marginVertical: 10,
  },
});
