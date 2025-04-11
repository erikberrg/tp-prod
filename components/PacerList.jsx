import React, { useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  Text,
} from "react-native";
import PacerItem from "./PacerItem";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";

export default function PacerList({ pacers, onStart, onDelete }) {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const [searchText, setSearchText] = useState("");
  const iconColor = isDarkTheme
    ? theme.darkColors.icon
    : theme.lightColors.icon;
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginHorizontal: 12,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
          onPress={() => setEditMode((prev) => !prev)}
        >
          <Text
            style={{
              fontSize: 18,
              color: isDarkTheme
                ? theme.darkColors.text
                : theme.lightColors.text,
              fontWeight: editMode ? "600" : "400",
            }}
          >
            {editMode ? "Done" : "Edit"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, editMode, isDarkTheme]);

  const filteredPacers = pacers.filter((pacer) =>
    pacer.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView style={{ width: "100%" }}>
      <View
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            width: "90%",
            height: 42,
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDarkTheme
              ? theme.darkColors.tabButton
              : theme.lightColors.tabButton,
            color: isDarkTheme ? theme.darkColors.text : theme.lightColors.text,
            borderRadius: 16,
            borderWidth: 0.6,
            borderColor: isDarkTheme
              ? theme.darkColors.border
              : theme.lightColors.border,
            paddingHorizontal: 6,
          }}
        >
          <Icon
            name="search"
            height="18"
            color={iconColor}
            strokeWidth={2}
          ></Icon>
          <TextInput
            placeholder="Search"
            clearButtonMode="always"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={
              isDarkTheme ? theme.darkColors.icon : theme.lightColors.icon
            }
            style={{
              flex: 1,
              paddingLeft: 6,
              height: 42,
              fontSize: 17,
            }}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.pacerList}>
        {filteredPacers.map((pacer) => (
          <PacerItem
            key={String(pacer.id)}
            pacer={pacer}
            onStart={() => {
              onStart(pacer);
            }}
            onDelete={() => {
              onDelete(pacer.id);
            }}
            editMode={editMode}
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
