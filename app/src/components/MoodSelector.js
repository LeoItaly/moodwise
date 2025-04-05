import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { moodIcons } from "../data/appData";

const MoodSelector = ({ label, selectedMood, onSelect }) => (
  <View style={styles.moodSelector}>
    <Text style={styles.moodLabel}>{label}</Text>
    <View style={styles.moodRow}>
      {moodIcons.map((mood, index) => (
        <TouchableOpacity
          key={`${label}-${index}`}
          style={[
            styles.moodButton,
            { backgroundColor: mood.color },
            selectedMood === index && styles.selectedMoodButton,
          ]}
          onPress={() => onSelect(selectedMood === index ? null : index)}
        >
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  moodSelector: {
    marginBottom: 20,
  },
  moodLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedMoodButton: {
    transform: [{ scale: 1.4 }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moodEmoji: {
    fontSize: 24,
  },
});

export default MoodSelector;
