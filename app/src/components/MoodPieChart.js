import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { sampleData, moodIcons, weather, activities } from "../data/appData";

const MoodPieChart = ({
  selectedMoodIndex,
  onPiePress,
  pulseAnim,
  newLogCount = 0,
}) => {
  // Animation reference for smooth transitions
  const sliceAnimValue = useRef(new Animated.Value(0)).current;

  // Animate when selection changes
  useEffect(() => {
    Animated.timing(sliceAnimValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      sliceAnimValue.setValue(0);
    });
  }, [selectedMoodIndex]);

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

  // Set total logs to fixed value plus any new logs
  const totalLogs = 31 + newLogCount;

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
    if (index === null || index === undefined) return "😐";

    // Index is 0-4 in our data, but moodIcons uses 1-5 for id
    // Check if index is valid
    if (index < 0 || index >= moodIcons.length) {
      return "😐"; // Default emoji for invalid index
    }

    const moodIcon = moodIcons[index];
    return moodIcon ? moodIcon.emoji : "😐";
  };

  // Get specific mood count
  const getMoodCount = (index) => {
    if (index === null || index === undefined) return null;
    return moodCounts[index];
  };

  // Get weather emoji by label
  const getWeatherEmoji = (weatherLabel) => {
    if (!weatherLabel) return "🌤️";
    const weatherItem = weather.find((w) => w.label === weatherLabel);
    return weatherItem ? weatherItem.icon : "🌤️";
  };

  // Get activity emoji by label
  const getActivityEmoji = (activityLabel) => {
    if (!activityLabel) return "🏃";
    const activityItem = activities.find((a) => a.label === activityLabel);
    return activityItem ? activityItem.icon : "🏃";
  };

  // Get mood summary for the selected mood
  const getMoodSummary = (index) => {
    if (index === null || index === undefined) return null;

    // Filter days with the selected mood
    const daysWithMood = sampleData.filter((day) => day.moods.includes(index));

    if (daysWithMood.length === 0) return "No data available for this mood";

    // Count activities and weather occurrences
    const activityCount = {};
    const weatherCount = {};

    daysWithMood.forEach((day) => {
      // Count activities
      if (day.activities && day.activities.length > 0) {
        day.activities.forEach((activity) => {
          activityCount[activity] = (activityCount[activity] || 0) + 1;
        });
      }

      // Count weather
      if (day.weather) {
        weatherCount[day.weather] = (weatherCount[day.weather] || 0) + 1;
      }
    });

    // Find most frequent activity and weather
    let mostFrequentActivity = "none";
    let maxActivityCount = 0;

    for (const [activity, count] of Object.entries(activityCount)) {
      if (count > maxActivityCount) {
        mostFrequentActivity = activity;
        maxActivityCount = count;
      }
    }

    let mostFrequentWeather = "unknown";
    let maxWeatherCount = 0;

    for (const [weather, count] of Object.entries(weatherCount)) {
      if (count > maxWeatherCount) {
        mostFrequentWeather = weather;
        maxWeatherCount = count;
      }
    }

    // Get mood label and emoji
    const moodLabels = ["Awful", "Bad", "Meh", "Good", "Radiant"];
    const moodLabel = moodLabels[index];
    const moodEmoji = getMoodEmoji(index);

    // Get weather and activity emojis
    const weatherEmoji = getWeatherEmoji(mostFrequentWeather);
    const activityEmoji =
      mostFrequentActivity !== "none"
        ? getActivityEmoji(mostFrequentActivity)
        : "🚫";

    return `When feeling ${moodLabel} ${moodEmoji}, you most often ${
      mostFrequentActivity !== "none"
        ? `do ${mostFrequentActivity} ${activityEmoji}`
        : "don't log activities 🚫"
    } during ${mostFrequentWeather} ${weatherEmoji} weather.`;
  };

  // Configure smoother animation
  const animationConfig = {
    animationDuration: 250,
    delay: 0,
    easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    useNativeDriver: true,
  };

  // Additional tap animation for the slices
  const tapAnimation = (index) => {
    // Create spring animation effect for smoother interaction
    Animated.spring(sliceAnimValue, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Call the parent's onPiePress function
    onPiePress(index);
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
          animate={true}
          animationConfig={animationConfig}
          onPress={(item, index) => tapAnimation(index)}
          // Added props to improve appearance and animation
          focusConfig={{
            scaleSize: 1.07,
            stroke: true,
            strokeWidth: 2,
            strokeColor: "#fff",
          }}
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
                    <Text style={styles.totalLogs}>
                      Total: {totalLogs} logs
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.centerLabelText}>{totalLogs}</Text>
                    <Text style={styles.centerLabelSubtext}>Total Logs</Text>
                  </>
                )}
              </View>
            );
          }}
        />
      </Animated.View>

      {selectedMoodIndex !== null && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            {getMoodSummary(selectedMoodIndex)}
          </Text>
        </View>
      )}

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
  totalLogs: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  summaryContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  summaryText: {
    fontSize: 14,
    color: "#1e293b",
    textAlign: "center",
    lineHeight: 20,
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
