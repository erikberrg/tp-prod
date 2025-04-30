import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  useColorScheme,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../constants/theme";
import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { formatRaceTime } from "../../helpers/calculations";

export const TimePicker = ({ minutes, seconds, hundredths, onChangeTime }) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const timesMin = Array.from({ length: 60 }, (_, i) => i);
  const timesSec = Array.from({ length: 59 }, (_, i) => i + 1);
  const timeHundredths = Array.from({ length: 100 }, (_, i) => i);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const toggleVisibility = (setter) => {
    Keyboard.dismiss();
    setter((prev) => !prev);
  };
  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            {
              color: isDarkTheme
                ? theme.darkColors.text
                : theme.lightColors.text,
            },
          ]}
        >
          Time
        </Text>
        <TouchableOpacity
          onPress={() => toggleVisibility(setIsTimePickerVisible)}
          style={[
            styles.button,
            {
              backgroundColor: isDarkTheme
                ? theme.darkColors.sectionButton
                : theme.lightColors.sectionButton,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                color: isDarkTheme
                  ? theme.darkColors.text
                  : theme.lightColors.text,
              },
            ]}
          >
            {formatRaceTime(minutes, seconds, hundredths)}
          </Text>
        </TouchableOpacity>
      </View>
      {isTimePickerVisible && (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutUp}
          style={styles.pickerContainer}
        >
          <Picker
            selectedValue={minutes}
            onValueChange={(min) => onChangeTime(min, seconds, hundredths)}
            style={styles.picker}
            itemStyle={{ fontSize: 14 }}
          >
            {timesMin.map((time) => (
              <Picker.Item key={time} label={`${time} min`} value={time} />
            ))}
          </Picker>
          <Picker
            selectedValue={seconds}
            onValueChange={(sec) => onChangeTime(minutes, sec, hundredths)}
            style={styles.picker}
            itemStyle={{ fontSize: 14 }}
          >
            {timesSec.map((time) => (
              <Picker.Item key={time} label={`${time} sec`} value={time} />
            ))}
          </Picker>
          <Picker
            selectedValue={hundredths}
            onValueChange={(newHundredths) =>
              onChangeTime(minutes, seconds, newHundredths)
            }
            style={styles.picker}
            itemStyle={{ fontSize: 14 }}
          >
            {timeHundredths.map((time) => (
              <Picker.Item key={time} label={`${time} hs`} value={time} />
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
    flex: 1,
    marginVertical: 10,
  },
});
