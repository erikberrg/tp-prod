import { View, useColorScheme } from "react-native";
import { theme } from "../../constants/theme";

const Divider = ({ ...props }) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const dividerColor = isDarkTheme
    ? theme.darkColors.divider
    : theme.lightColors.divider;

  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
      <View
        style={{
          width: "90%",
          height: 1,
          borderBottomColor: dividerColor,
          borderBottomWidth: 0.3,
          ...props.style,
        }}
      />
    </View>
  );
};

export default Divider;
