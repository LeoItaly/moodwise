import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { sampleData, moodIcons } from "../data/appData";

const MoodPieChart = ({
  selectedMoodIndex,
  onPiePress,
  pulseAnim,
  newLogCount = 0,
}) => {
  // Calculate mood distribution for pie chart
  const moodCounts = {
    0: 0, // awful
    1: 0, // bad
    2: 0, // meh
    3: 0, // good
    4: 0, // radiant
  };

  // Count all moods (both morning and evening)
  sampleData.forEach((day) => {
    day.moods.forEach((mood) => {
      moodCounts[mood]++;
    });
  });

  // Convert mood counts to pie chart data
  const pieData = [
    {
      value: moodCounts[0],
      color: "#ef4444",
      focused: selectedMoodIndex === 0,
      label: "Awful",
    },
    {
      value: moodCounts[1],
      color: "#f97316",
      focused: selectedMoodIndex === 1,
      label: "Bad",
    },
    {
      value: moodCounts[2],
      color: "#facc15",
      focused: selectedMoodIndex === 2,
      label: "Meh",
    },
    {
      value: moodCounts[3],
      color: "#84cc16",
      focused: selectedMoodIndex === 3,
      label: "Good",
    },
    {
      value: moodCounts[4],
      color: "#22c55e",
      focused: selectedMoodIndex === 4,
      label: "Radiant",
    },
  ];

  // Get mood emoji from moodIcons based on index
  const getMoodEmoji = (index) => {
    if (index === null || index === undefined) return null;
    // Index is 0-4 in our data, but moodIcons uses 1-5 for id
    return moodIcons[index].emoji;
  };

  // Get specific mood count
  const getMoodCount = (index) => {
    if (index === null || index === undefined) return null;
    return moodCounts[index];
  };

  return (
    <View style={styles.pieChartContainer}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <PieChart
          data={pieData}
          donut
          showText
          textColor="#1e293b"
          radius={120}
          innerRadius={60}
          textSize={12}
          focusOnPress
          onPress={(item, index) => onPiePress(index)}
          centerLabelComponent={() => {
            return (
              <View style={styles.centerLabel}>
                {selectedMoodIndex !== null ? (
                  <>
                    <Text style={styles.emojiText}>
                      {getMoodEmoji(selectedMoodIndex)}
                    </Text>
                    <Text style={styles.centerLabelSubtext}>
                      {getMoodCount(selectedMoodIndex)} logs
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.centerLabelText}>
                      {31 + newLogCount}
                    </Text>
                    <Text style={styles.centerLabelSubtext}>Total Logs</Text>
                  </>
                )}
              </View>
            );
          }}
        />
      </Animated.View>
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>Tap to highlight mood</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pieChartContainer: {
    alignItems: "center",
  },
  centerLabel: {
    alignItems: "center",
  },
  centerLabelText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  emojiText: {
    fontSize: 32,
  },
  centerLabelSubtext: {
    fontSize: 14,
    color: "#64748b",
  },
  hintContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  hintText: {
    fontSize: 14,
    color: "#64748b",
  },
});

export default MoodPieChart;
