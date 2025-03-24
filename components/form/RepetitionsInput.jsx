import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity, Keyboard, useColorScheme } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../constants/theme";
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";

export const RepetitionsInput = ({ repetitions, onChangeRepetitions }) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const times = Array.from({ length: 60 }, (_, i) => i);
  const [isRepetitionPickerVisible, setIsRepetitionPickerVisible] = useState(false);
  const toggleVisibility = (setter) => {
    Keyboard.dismiss();
    setter((prev) => !prev);
  };
  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label,{color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text}]}>Repetitions</Text>
        <TouchableOpacity
          onPress={() => toggleVisibility(setIsRepetitionPickerVisible)}
          style={[styles.button,{backgroundColor: isDarkTheme ? theme.darkColors.sectionButton : theme.lightColors.sectionButton}]}
        >
        <Text style={[styles.label,{color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text}]}>{repetitions} times</Text>
        </TouchableOpacity>
      </View>
      {isRepetitionPickerVisible && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.pickerContainer}>
          <Picker
            selectedValue={repetitions}
            onValueChange={(repetitions) => onChangeRepetitions(repetitions)}
            style={styles.picker}
          >
            {times.map((repetitions) => (
              <Picker.Item key={repetitions} label={`${repetitions} times`} value={repetitions} />
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
    width: "100%",  },
});
