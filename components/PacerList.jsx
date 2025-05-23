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
import * as Haptics from "expo-haptics";

export default function PacerList({ pacers, onStart, onDelete }) {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const [searchText, setSearchText] = useState("");
  const iconColor = isDarkTheme
    ? theme.darkColors.icon
    : theme.lightColors.icon;
  const headerColor = isDarkTheme
    ? theme.darkColors.subtext
    : theme.lightColors.subtext;
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 4,
            }}
            onPress={() => setEditMode((prev) => !prev)}
          >
            <Text
              style={{
                fontSize: 18,
                color: isDarkTheme
                  ? theme.darkColors.subtext
                  : theme.lightColors.subtext,
                fontWeight: editMode ? "600" : "400",
              }}
            >
              {editMode ? "Done" : "Edit"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginHorizontal: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 4,
            }}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            onPress={() => {
              navigation.navigate("Modal");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
            }}
          >
            <Icon name="plus" height="20" strokeWidth={2} color={headerColor} />
          </TouchableOpacity>
        </View>
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
              ? theme.darkColors.section
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
