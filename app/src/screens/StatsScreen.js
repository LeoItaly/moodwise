import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Linking,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ChartCard from "../components/ChartCard";
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
import ActivityWeatherPieChart from "../components/ActivityWeatherPieChart";
import WeeklyMoodTrend from "../components/WeeklyMoodTrend";
import { LinearGradient } from "expo-linear-gradient";

export default function StatsScreen() {
  const [selectedData, setSelectedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(null);
  const [newMoodLogCount, setNewMoodLogCount] = useState(0);
  const pulseAnim = new Animated.Value(1);
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const buttonOpacityAnim = useRef(new Animated.Value(1)).current;

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

    // Create a sequence for the button animation
    const buttonPulseSequence = Animated.sequence([
      // Scale up and increase opacity
      Animated.parallel([
        Animated.timing(buttonScaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacityAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Scale down and restore opacity
      Animated.parallel([
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Start the looping animation for the button
    Animated.loop(buttonPulseSequence).start();
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

  const handleAdvancedAnalysisLink = () => {
    Linking.openURL(
      "https://observablehq.com/@dtu/personaldataintegration_g20"
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ChartCard title="Mood Distribution">
        <Text style={styles.chartDescription}>
          Overview of your mood entries and patterns
        </Text>
        <MoodPieChart
          selectedMoodIndex={selectedMoodIndex}
          onPiePress={handlePiePress}
          pulseAnim={pulseAnim}
          newLogCount={newMoodLogCount}
        />
      </ChartCard>

      <ChartCard title="Weekly Mood Trend">
        <Text style={styles.chartDescription}>
          Your average daily mood over the past week
        </Text>
        <Text style={styles.interactionHint}>
          Tap on any data point to see details
        </Text>
        <WeeklyMoodTrend onDataPress={handleDataPress} />
      </ChartCard>

      <ChartCard title="Daily Mood Changes">
        <Text style={styles.chartDescription}>
          How your mood shifts from morning to evening
        </Text>
        <Text style={styles.interactionHint}>
          Tap on any data point to see details
        </Text>
        <MoodSlopePlot onDataPress={handleDataPress} />
      </ChartCard>

      <ChartCard title="Activity & Weather Insights">
        <Text style={styles.chartDescription}>
          Frequency and average mood for each category
        </Text>
        <ActivitiesWeatherBarChart
          onDataPress={handleDataPress}
          initialFilter="Activity"
        />
      </ChartCard>

      <ChartCard title="Relationship Summary">
        <Text style={styles.chartDescription}>
          Discover patterns between your activities, weather conditions, and
          mood
        </Text>
        <ActivityWeatherPieChart
          initialFilter="Activity"
          onSlicePress={handleDataPress}
        />
      </ChartCard>

      {/* Advanced Data Analysis Promotion */}
      <LinearGradient
        colors={["#ffffff", "#f0f9ff", "#ffffff"]}
        style={[styles.chartContainer, styles.advancedAnalysisContainer]}
      >
        <Text style={styles.advancedAnalysisTitle}>Advanced Analysis</Text>
        <Text style={styles.chartDescription}>
          Explore deeper and more complex patterns in your mood data
        </Text>
        <Animated.View
          style={{
            transform: [{ scale: buttonScaleAnim }],
            opacity: buttonOpacityAnim,
            alignSelf: "center",
            marginTop: spacing.md,
          }}
        >
          <TouchableOpacity
            style={styles.advancedAnalysisButton}
            onPress={handleAdvancedAnalysisLink}
            accessibilityRole="link"
            accessibilityLabel="Visit advanced data analysis website"
          >
            <Text style={styles.advancedAnalysisButtonText}>
              View detailed insights
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

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
  interactionHint: {
    ...textStyles.caption,
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
    fontStyle: "italic",
  },
  chartContainer: {
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "visible",
  },
  advancedAnalysisContainer: {
    marginBottom: spacing.xl,
  },
  advancedAnalysisTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  advancedAnalysisButton: {
    ...buttons.primary,
    margin: 0,
    width: "100%",
  },
  advancedAnalysisButtonText: {
    ...buttons.primaryText,
    textAlign: "center",
  },
});
