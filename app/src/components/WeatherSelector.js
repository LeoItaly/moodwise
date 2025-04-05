import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { weather } from "../data/appData";

const WeatherSelector = ({ selectedWeather, onSelectWeather }) => (
  <View style={styles.iconRow}>
    {weather.map((option) => (
      <TouchableOpacity
        key={option.label}
        style={[
          styles.iconButton,
          selectedWeather === option.label && styles.selectedIcon,
        ]}
        onPress={() =>
          onSelectWeather(
            selectedWeather === option.label ? null : option.label
          )
        }
      >
        <Text style={styles.iconText}>{option.icon}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  selectedIcon: {
    backgroundColor: "#00BFFF",
    transform: [{ scale: 1.2 }],
  },
  iconText: {
    fontSize: 24,
  },
});

export default WeatherSelector;
