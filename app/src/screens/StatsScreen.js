import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ChartCard from "../components/ChartCard";
import MoodLineChart from "../components/MoodLineChart";
import MoodBarChart from "../components/MoodBarChart";
import MoodSlopePlot from "../components/MoodSlopePlot";
import DetailModal from "../components/DetailModal";
import ActivitiesWeatherBarChart from "../components/ActivitiesWeatherBarChart";
import {
  colors,
  layout,
  buttons,
  spacing,
  textStyles,
  borderRadius,
} from "../constants";
import { sampleData, activities, weather } from "../data/appData";
import MoodPieChart from "../components/MoodPieChart";
import MoodBreakdown from "../components/MoodBreakdown";
import ActivityWeatherPieChart from "../components/ActivityWeatherPieChart";
import MoodTrendLineChart from "../components/MoodTrendLineChart";

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

  // Process data for each chart type before displaying in the modal
  const handleDataPress = (data) => {
    // If data from bar chart (has type property)
    if (data.type) {
      setSelectedData(data);
    }
    // If data has date property but not full moods array (from line chart)
    else if (
      data.date &&
      !data.moods &&
      (data.morningMood !== undefined || data.eveningMood !== undefined)
    ) {
      // Find the full day data for that date
      const dayData = sampleData.find((day) => day.date === data.date);
      if (dayData) {
        setSelectedData(dayData);
      } else {
        // Create a compatible structure if we don't have the full data
        setSelectedData({
          date: data.date,
          moods: [data.morningMood, data.eveningMood],
          activities: [],
          weather: null,
        });
      }
    }
    // If it's already a complete day object (from slope plot)
    else if (data.date && data.moods) {
      setSelectedData(data);
    }

    setModalVisible(true);
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

  return (
    <ScrollView style={styles.container}>
      <ChartCard title="Mood Trend">
        <Text style={styles.chartDescription}>
          Average daily mood trends over your selected time period
        </Text>
        <MoodTrendLineChart onDataPress={handleDataPress} />
      </ChartCard>

      <ChartCard title="Mood Over Time">
        <Text style={styles.chartDescription}>
          Morning and evening mood scores shown separately
        </Text>
        <MoodLineChart onDataPress={handleDataPress} />
      </ChartCard>

      <ChartCard title="Daily Mood Changes">
        <Text style={styles.chartDescription}>
          How your mood shifts from morning to evening
        </Text>
        <MoodSlopePlot onDataPress={handleDataPress} />
      </ChartCard>

      {/* Global filter for Activity/Weather charts */}
      <View style={styles.globalFilterContainer}>
        <Text style={styles.globalFilterTitle}>
          Select data type for chart below:
        </Text>
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

      <ChartCard title={`${selectedFilter} Insights`}>
        <Text style={styles.chartDescription}>
          Frequency and average mood for each {selectedFilter.toLowerCase()}
        </Text>
        <ActivitiesWeatherBarChart
          selectedFilter={selectedFilter}
          onDataPress={handleDataPress}
        />
      </ChartCard>

      <ChartCard title={`${selectedFilter} Distribution`}>
        <Text style={styles.chartDescription}>
          Distribution of {selectedFilter.toLowerCase()} categories
        </Text>
        <ActivityWeatherPieChart selectedFilter={selectedFilter} />
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
      <DetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedDay={selectedData}
      />
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
    alignSelf: "center",
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
  chartDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  globalFilterContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  globalFilterTitle: {
    ...textStyles.body,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
});
