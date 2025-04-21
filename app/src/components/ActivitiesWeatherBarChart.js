import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { sampleData, activities, weather, moodIcons } from "../data/appData";
import { colors } from "../constants";

const ActivitiesWeatherBarChart = ({ onDataPress, selectedFilter }) => {
  // Get screen width for chart sizing
  const screenWidth = Dimensions.get("window").width;

  // Calculate optimal chart width based on number of items
  const calculateChartWidth = (itemCount) => {
    // Base width calculations
    const barWidth = 30;
    const barSpacing = 40;
    const initialSpacing = 10;
    const endSpacing = 10;

    // Different width adjustments based on filter
    let additionalWidth = 0;
    if (selectedFilter === "Weather") {
      // Weather typically has fewer categories, we can make it more compact
      additionalWidth = 20;
    } else {
      // Activities might have more items
      additionalWidth = 40;
    }

    // Calculate total width needed:
    // initialSpacing + (barWidth + barSpacing) * itemCount + endSpacing + additionalWidth
    const requiredWidth =
      initialSpacing +
      (barWidth + barSpacing) * itemCount +
      endSpacing +
      additionalWidth;

    // For very few items, make sure we're at least using most of the screen
    const minWidth = Math.min(screenWidth - 40, 400);

    return Math.max(minWidth, requiredWidth);
  };

  // Debug logging
  useEffect(() => {
    console.log("ActivitiesWeatherBarChart - Selected Filter:", selectedFilter);
  }, [selectedFilter]);

  // Get color based on mood value
  const getMoodColor = (moodValue) => {
    if (moodValue < 1) return colors.mood.awful;
    if (moodValue < 2) return colors.mood.bad;
    if (moodValue < 3) return colors.mood.neutral;
    if (moodValue < 4) return colors.mood.good;
    return colors.mood.great;
  };

  // Calculate data for bar chart
  const chartData = useMemo(() => {
    console.log("Processing chart data for filter:", selectedFilter);

    // Map of all activities/weather entries in data with counts and mood sums
    const dataMap = new Map();

    // Initialize with "No Activity" category if we're in Activity mode
    if (selectedFilter === "Activity") {
      dataMap.set("No Activity", { count: 0, moodSum: 0, days: [] });
    }

    // Process each day's data
    sampleData.forEach((day) => {
      const avgDayMood = (day.moods[0] + day.moods[1]) / 2;

      if (selectedFilter === "Activity") {
        // Handle days with no activities
        if (day.activities.length === 0) {
          const item = dataMap.get("No Activity");
          item.count++;
          item.moodSum += avgDayMood;
          item.days.push(day);
        } else {
          // Handle each activity for the day
          day.activities.forEach((activityName) => {
            if (!dataMap.has(activityName)) {
              dataMap.set(activityName, { count: 0, moodSum: 0, days: [] });
            }
            const item = dataMap.get(activityName);
            item.count++;
            item.moodSum += avgDayMood;
            item.days.push(day);
          });
        }
      } else if (selectedFilter === "Weather") {
        // Process weather data
        if (day.weather) {
          // Ensure weather data exists
          const weatherName = day.weather;
          if (!dataMap.has(weatherName)) {
            dataMap.set(weatherName, { count: 0, moodSum: 0, days: [] });
          }
          const item = dataMap.get(weatherName);
          item.count++;
          item.moodSum += avgDayMood;
          item.days.push(day);
        }
      }
    });

    console.log("Data Map entries:", Array.from(dataMap.keys()));

    // Convert map to chart data array
    const result = [];

    if (selectedFilter === "Activity") {
      // Add "No Activity" first if it has entries
      const noActivity = dataMap.get("No Activity");
      if (noActivity && noActivity.count > 0) {
        const avgMood =
          noActivity.count > 0 ? noActivity.moodSum / noActivity.count : 0;
        result.push({
          value: noActivity.count,
          label: "❌",
          labelText: "No Activity",
          frontColor: getMoodColor(avgMood),
          topLabelComponent: () => (
            <Text style={styles.topLabel}>{noActivity.count}</Text>
          ),
          type: "Activity",
          name: "No Activity",
          avgMood,
          days: noActivity.days,
        });
      }

      // Add all activities
      activities.forEach((activity) => {
        if (dataMap.has(activity.label)) {
          const data = dataMap.get(activity.label);
          const avgMood = data.count > 0 ? data.moodSum / data.count : 0;
          result.push({
            value: data.count,
            label: activity.icon,
            labelText: activity.label,
            frontColor: getMoodColor(avgMood),
            topLabelComponent: () => (
              <Text style={styles.topLabel}>{data.count}</Text>
            ),
            type: "Activity",
            name: activity.label,
            avgMood,
            days: data.days,
          });
        }
      });
    } else if (selectedFilter === "Weather") {
      // Debug log weather data
      console.log("Weather data in map:", Array.from(dataMap.entries()));

      // Add all weather types
      weather.forEach((weatherType) => {
        if (dataMap.has(weatherType.label)) {
          const data = dataMap.get(weatherType.label);
          const avgMood = data.count > 0 ? data.moodSum / data.count : 0;

          console.log(
            `Adding weather: ${weatherType.label}, count: ${data.count}, avg: ${avgMood}`
          );

          result.push({
            value: data.count,
            label: weatherType.icon,
            labelText: weatherType.label,
            frontColor: getMoodColor(avgMood),
            topLabelComponent: () => (
              <Text style={styles.topLabel}>{data.count}</Text>
            ),
            type: "Weather",
            name: weatherType.label,
            avgMood,
            days: data.days,
          });
        }
      });
    }

    console.log("Final chart data items:", result.length);
    return result;
  }, [selectedFilter]);

  // Debug output for rendered chart data
  useEffect(() => {
    console.log("Chart data for rendering:", chartData.length, "items");
  }, [chartData]);

  // Handle bar press - pass detailed data to parent
  const handleBarPress = (item) => {
    if (onDataPress) {
      onDataPress({
        type: item.type,
        name: item.name,
        value: item.avgMood,
        count: item.value,
        days: item.days,
        isCountData: true, // Flag to differentiate from other bar chart data
      });
    }
  };

  return (
    <>
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Bar Color = Average Mood</Text>
        <View style={styles.legendItems}>
          {moodIcons.map((mood) => (
            <View key={mood.id} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: mood.color }]}
              />
              <Text style={styles.legendEmoji}>{mood.emoji}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Filter indicator */}
      <View style={styles.filterBadgeContainer}>
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>
            {selectedFilter === "Activity"
              ? "🏃 Activity Data"
              : "☁️ Weather Data"}
          </Text>
        </View>
      </View>

      {chartData.length === 0 ? (
        <Text style={styles.noDataText}>
          No data available for {selectedFilter}
        </Text>
      ) : (
        <View style={styles.chartContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[
              styles.barChartScrollContainer,
              { width: calculateChartWidth(chartData.length) },
            ]}
            bounces={false}
          >
            <BarChart
              data={chartData}
              height={250}
              width={calculateChartWidth(chartData.length)}
              spacing={40}
              initialSpacing={10}
              barWidth={30}
              noOfSections={5}
              maxValue={10}
              stepValue={2}
              barBorderRadius={6}
              backgroundColor="transparent"
              xAxisColor="#94a3b8"
              yAxisColor="#94a3b8"
              yAxisTextStyle={{ color: "#64748b", fontWeight: "500" }}
              xAxisLabelTextStyle={{
                color: "#64748b",
                fontSize: 12,
                fontWeight: "500",
              }}
              hideRules
              disablePress={false}
              onPress={handleBarPress}
              renderTooltip={(item) => {
                return (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle}>{item.labelText}</Text>
                    <Text style={styles.tooltipText}>Count: {item.value}</Text>
                    <Text style={styles.tooltipText}>
                      Avg. Mood: {item.avgMood.toFixed(1)}
                    </Text>
                  </View>
                );
              }}
            />
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  barChartScrollContainer: {
    paddingRight: 20,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  topLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },
  legendContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  legendTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendEmoji: {
    fontSize: 18,
  },
  tooltip: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  tooltipTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  tooltipText: {
    fontSize: 12,
  },
  filterBadgeContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  filterBadge: {
    backgroundColor: colors.background.secondary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 14,
    color: colors.text.secondary,
    marginVertical: 50,
  },
});

export default ActivitiesWeatherBarChart;
