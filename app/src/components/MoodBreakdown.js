import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moodIcons } from "../data/appData";

const MoodBreakdown = ({ moodCounts, selectedMoodIndex }) => {
  return (
    <View style={styles.moodBreakdown}>
      <Text style={styles.breakdownTitle}>Total Logs</Text>
      <View style={styles.moodGrid}>
        {moodIcons.map((mood, index) => {
          const count = moodCounts[mood.id - 1];
          if (count === 0) return null;

          return (
            <View key={mood.id} style={styles.moodItem}>
              <View
                style={[
                  styles.moodEmojiContainer,
                  selectedMoodIndex === index && {
                    backgroundColor: mood.color,
                  },
                ]}
              >
                <Text style={[styles.moodEmoji, { fontSize: 24 }]}>
                  {mood.emoji}
                </Text>
              </View>
              <Text style={[styles.moodCount, { color: mood.color }]}>
                {count}
              </Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  moodBreakdown: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 16,
    textAlign: "center",
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  moodItem: {
    alignItems: "center",
    minWidth: 80,
  },
  moodCount: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  moodEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  moodEmoji: {
    fontSize: 24,
  },
});

export default MoodBreakdown;
