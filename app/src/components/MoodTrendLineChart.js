import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { sampleData, moodIcons } from "../data/appData";
import { colors } from "../constants";
import { getMoodColor, getMoodEmoji } from "../utils/moodUtils";

const MoodTrendLineChart = ({ onDataPress }) => {
  const [selectedRange, setSelectedRange] = useState("7"); // Default to last 7 days
  const scrollViewRef = useRef(null);

  // Screen width for responsive sizing
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = Math.min(screenWidth * 0.9, 500);

  // Format date for display on x-axis
  const formatAxisDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Get emoji from moodIcons array (matching app's emojis)
  const getEmojiFromMoodIcons = (value) => {
    // Convert value to index (0-4 to array index)
    const index = Math.min(Math.max(Math.floor(value), 0), 4);
    // moodIcons uses 1-indexed IDs
    const moodIcon = moodIcons.find((icon) => icon.id === index + 1);
    return moodIcon ? moodIcon.emoji : "😐";
  };

  // Get filtered and processed data based on selected range
  const chartData = useMemo(() => {
    // Sort data by date
    const sortedData = [...sampleData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Filter data based on selected range
    let filteredData = sortedData;

    if (selectedRange !== "all") {
      const daysToShow = parseInt(selectedRange);

      // Create a date object for the cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToShow + 1);
      cutoffDate.setHours(0, 0, 0, 0); // Start of the day

      // Filter data that is on or after the cutoff date
      filteredData = sortedData.filter((day) => {
        const dayDate = new Date(day.date);
        return dayDate >= cutoffDate;
      });

      // If we don't have enough days after filtering, take the most recent ones
      if (filteredData.length < daysToShow && sortedData.length >= daysToShow) {
        filteredData = sortedData.slice(-daysToShow);
      }
    }

    // Map data to chart format
    return filteredData.map((day) => {
      const avgMood = (day.moods[0] + day.moods[1]) / 2;
      const displayDate = formatAxisDate(day.date);

      return {
        value: avgMood,
        date: day.date,
        label: displayDate,
        labelTextStyle: {
          fontSize: 10,
          color: colors.text.secondary,
          marginTop: 5,
        },
        activities: day.activities,
        weather: day.weather,
        moods: day.moods,
        dataPointColor: getMoodColor(avgMood),
        showDataPoint: true,
      };
    });
  }, [selectedRange]);

  // Fast direct modal display for immediate response
  const handleDataPointPress = (item) => {
    if (onDataPress) {
      // Find the original full data item to ensure all properties are included
      const fullDataItem =
        sampleData.find((day) => day.date === item.date) || item;
      // Call handler immediately with no delay
      onDataPress(fullDataItem);
    }
  };

  // Render manual data points for better touch interaction
  const renderDataPoints = () => {
    const pointSize = 14; // Slightly smaller but still easy to tap

    return chartData.map((item, index) => {
      // Calculate position
      const xPosition = index * dataPointSpacing + (isLongDataset ? 20 : 30);
      const yPosition = 220 - (item.value / 4) * 220 - pointSize / 2 + 10; // Adjust for chart height

      return (
        <TouchableOpacity
          key={`point-${index}`}
          style={[
            styles.touchableDataPoint,
            {
              left: xPosition,
              top: yPosition,
              backgroundColor: item.dataPointColor,
              width: pointSize,
              height: pointSize,
              borderRadius: pointSize / 2,
            },
          ]}
          activeOpacity={0.6}
          onPress={() => handleDataPointPress(item)}
        />
      );
    });
  };

  // Determine if the data set covers > 14 days
  const isLongDataset = chartData.length > 14;

  // Calculate spacing between data points
  const dataPointSpacing = useMemo(() => {
    if (isLongDataset) return 50;
    // Adjust spacing based on number of data points for better visualization
    if (chartData.length <= 3) return chartWidth / 3;
    if (chartData.length <= 7) return chartWidth / (chartData.length * 1.5);
    return chartWidth / (chartData.length + 1);
  }, [chartData.length, chartWidth, isLongDataset]);

  return (
    <View style={styles.container}>
      {/* Time range filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedRange === "7" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedRange("7")}
        >
          <Text
            style={[
              styles.filterText,
              selectedRange === "7" && styles.filterTextActive,
            ]}
          >
            Last 7 Days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedRange === "30" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedRange("30")}
        >
          <Text
            style={[
              styles.filterText,
              selectedRange === "30" && styles.filterTextActive,
            ]}
          >
            Last 30 Days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedRange === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedRange("all")}
        >
          <Text
            style={[
              styles.filterText,
              selectedRange === "all" && styles.filterTextActive,
            ]}
          >
            All Time
          </Text>
        </TouchableOpacity>
      </View>

      {/* Indicator of how many days are shown */}
      <View style={styles.dataCountContainer}>
        <Text style={styles.dataCountText}>
          Showing {chartData.length} days
        </Text>
      </View>

      {/* Chart container */}
      <View style={styles.chartWrapper}>
        {/* Custom Y-axis with emojis */}
        <View style={styles.yAxisLabels}>
          {[4, 3, 2, 1, 0].map((value) => (
            <Text key={value} style={styles.yLabel}>
              {getEmojiFromMoodIcons(value)}
            </Text>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal={isLongDataset}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.chartScrollContainer}
          >
            <View style={styles.chartWithPoints}>
              <LineChart
                data={chartData}
                height={220}
                width={
                  isLongDataset
                    ? Math.max(chartWidth, chartData.length * dataPointSpacing)
                    : chartWidth
                }
                spacing={dataPointSpacing}
                initialSpacing={isLongDataset ? 20 : 30}
                endSpacing={isLongDataset ? 20 : 30}
                color={colors.primary}
                thickness={3}
                dataPointsColor={null}
                startFillColor={colors.primary}
                endFillColor={"transparent"}
                startOpacity={0.3}
                endOpacity={0.1}
                noOfSections={4}
                maxValue={4}
                yAxisColor={colors.border.light}
                xAxisColor={colors.border.light}
                yAxisTextStyle={styles.axisText}
                yAxisLabelSuffix=""
                hideYAxisText
                xAxisLabelTextStyle={styles.xAxisLabel}
                hideDataPoints={true}
                dataPointsRadius={0}
                hideOrigin
                curved
              />

              {/* Custom interactive data points */}
              {renderDataPoints()}
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.chartFooter}>
        <Text style={styles.footerText}>
          Average daily mood (morning + evening / 2)
        </Text>
        {isLongDataset && (
          <Text style={styles.scrollHint}>Scroll horizontally to see more</Text>
        )}
        <Text style={styles.tapHint}>Tap any point to see details</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: "600",
  },
  dataCountContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  dataCountText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: "italic",
  },
  chartWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.background.light,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  yAxisLabels: {
    height: 220,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginRight: 8,
    marginLeft: 2,
    width: 30, // Fixed width for better alignment
  },
  yLabel: {
    fontSize: 16,
    textAlign: "center", // Center emojis
  },
  chartContainer: {
    flex: 1,
    position: "relative",
  },
  chartWithPoints: {
    position: "relative",
  },
  chartScrollContainer: {
    paddingBottom: 5,
  },
  touchableDataPoint: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  axisText: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  xAxisLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: 5,
  },
  chartFooter: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  scrollHint: {
    fontSize: 10,
    fontStyle: "italic",
    color: colors.text.secondary,
    marginTop: 2,
  },
  tapHint: {
    fontSize: 10,
    fontStyle: "italic",
    color: colors.text.primary,
    marginTop: 4,
  },
});

export default MoodTrendLineChart;
