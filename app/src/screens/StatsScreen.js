import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ChartCard from "../components/ChartCard";
import MoodLineChart from "../components/MoodLineChart";
import MoodBarChart from "../components/MoodBarChart";
import {
  colors,
  layout,
  buttons,
  spacing,
  textStyles,
  borderRadius,
} from "../constants";
import { sampleData, activities, weather } from "../data/appData";
import { LinearGradient } from "expo-linear-gradient";
import MoodPieChart from "../components/MoodPieChart";
import MoodBreakdown from "../components/MoodBreakdown";

export default function StatsScreen() {
  const [selectedData, setSelectedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Activity");
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(null);
  const [newMoodLogCount, setNewMoodLogCount] = useState(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Start pulsing animation for pie chart
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Days of week for x-axis labels
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Process data for line chart (mood over time)
  const moodOverTimeData = sampleData.slice(0, 7).map((item, index) => {
    const avgMood = (item.moods[0] + item.moods[1]) / 2;
    return {
      value: avgMood,
      label: daysOfWeek[index],
      dataPointText: avgMood.toFixed(1),
      date: item.date,
      morningMood: item.moods[0],
      eveningMood: item.moods[1],
    };
  });

  // Activity icons mapping
  const activityIcons = {
    Football: "⚽",
    Gymnastics: "🤸",
    Swimming: "🏊",
    Gym: "🏋️",
    Walking: "🚶",
    Badminton: "🏸",
    Handball: "🤾",
    Tennis: "🎾",
    Running: "🏃",
    Others: "🏋️‍♂️",
  };

  // Weather icons mapping
  const weatherIcons = {
    Sunny: "☀️",
    Cloudy: "☁️",
    Windy: "💨",
    Rainy: "🌧️",
    Snowy: "❄️",
  };

  // Process data for bar chart based on selected filter
  const getBarChartData = () => {
    if (selectedFilter === "Activity") {
      return activities.map((activity) => {
        const activityDays = sampleData.filter((day) =>
          day.activities.includes(activity.label)
        );
        const avgMood =
          activityDays.length > 0
            ? activityDays.reduce((sum, day) => {
                return sum + (day.moods[0] + day.moods[1]) / 2;
              }, 0) / activityDays.length
            : 0;

        const color =
          avgMood < 1 ? "#ef4444" : avgMood < 3 ? "#facc15" : "#22c55e";

        return {
          value: avgMood,
          label: activityIcons[activity.label],
          dataPointText: avgMood.toFixed(1),
          count: activityDays.length,
          frontColor: color,
          type: "Activity",
          name: activity.label,
        };
      });
    } else {
      return weather.map((weatherType) => {
        const weatherDays = sampleData.filter(
          (day) => day.weather === weatherType.label
        );
        const avgMood =
          weatherDays.length > 0
            ? weatherDays.reduce((sum, day) => {
                return sum + (day.moods[0] + day.moods[1]) / 2;
              }, 0) / weatherDays.length
            : 0;

        const color =
          avgMood < 1 ? "#ef4444" : avgMood < 3 ? "#facc15" : "#22c55e";

        return {
          value: avgMood,
          label: weatherIcons[weatherType.label],
          dataPointText: avgMood.toFixed(1),
          count: weatherDays.length,
          frontColor: color,
          type: "Weather",
          name: weatherType.label,
        };
      });
    }
  };

  const renderTooltip = (data) => {
    if (!data) return null;

    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipTitle}>
          {data.date ? "Date: " + data.date : `${data.type}: ${data.name}`}
        </Text>
        {data.date ? (
          <>
            <Text style={styles.tooltipText}>
              Morning Mood: {data.morningMood}
            </Text>
            <Text style={styles.tooltipText}>
              Evening Mood: {data.eveningMood}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.tooltipText}>
              Average Mood: {data.value.toFixed(1)}
            </Text>
            <Text style={styles.tooltipText}>Times Logged: {data.count}</Text>
          </>
        )}
      </View>
    );
  };

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

  const handlePiePress = (index) => {
    setSelectedMoodIndex(index);
  };

  // This function would be called when a new mood is logged
  const handleMoodLogged = () => {
    setNewMoodLogCount((prev) => prev + 1);
  };

  return (
    <ScrollView style={styles.container}>
      <ChartCard title="Mood Over Time">
        <MoodLineChart
          onDataPress={(data) => {
            setSelectedData(data);
            setModalVisible(true);
          }}
        />
      </ChartCard>

      <ChartCard title={`Mood by ${selectedFilter}`}>
        <View style={styles.filterContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFilter}
              onValueChange={(value) => setSelectedFilter(value)}
              style={styles.picker}
              dropdownIconColor={colors.text.secondary}
            >
              <Picker.Item label="Activity" value="Activity" />
              <Picker.Item label="Weather" value="Weather" />
            </Picker>
          </View>
        </View>
        <MoodBarChart
          filterType={selectedFilter}
          onDataPress={(data) => {
            setSelectedData(data);
            setModalVisible(true);
          }}
        />
      </ChartCard>

      <ChartCard title="Mood Distribution">
        <MoodPieChart
          selectedMoodIndex={selectedMoodIndex}
          onPiePress={handlePiePress}
          pulseAnim={pulseAnim}
          newLogCount={newMoodLogCount}
        />

        <MoodBreakdown
          moodCounts={moodCounts}
          selectedMoodIndex={selectedMoodIndex}
        />
      </ChartCard>

      {/* Modal for Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {renderTooltip(selectedData)}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: layout.container,
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: "hidden",
  },
  picker: {
    width: 150,
    height: Platform.OS === "ios" ? 200 : 55,
    color: colors.text.secondary,
  },
  modalOverlay: layout.modalOverlay,
  modalContent: {
    ...layout.modalContent,
    width: "85%",
  },
  tooltip: {
    padding: spacing.md,
  },
  tooltipTitle: {
    ...textStyles.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tooltipText: {
    fontSize: textStyles.body.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  closeButton: buttons.close,
  closeButtonText: buttons.closeText,
});
