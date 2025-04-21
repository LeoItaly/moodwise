import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { sampleData, activities, weather, moodIcons } from "../data/appData";
import { colors } from "../constants";
import CategoryDetailModal from "./CategoryDetailModal";
import { getMoodColor, getMoodEmoji } from "../utils/moodUtils";

const ActivityWeatherPieChart = ({ selectedFilter, onSlicePress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get screen dimensions for responsive sizing
  const screenWidth = Dimensions.get("window").width;
  const chartSize = Math.min(screenWidth - 60, 300); // Cap at 300px max

  // Process data for pie chart
  const pieData = useMemo(() => {
    // Map of all activities/weather entries with counts and mood sums
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
              dataMap.set(activityName, {
                count: 0,
                moodSum: 0,
                days: [],
                weatherTypes: {},
              });
            }
            const item = dataMap.get(activityName);
            item.count++;
            item.moodSum += avgDayMood;
            item.days.push(day);

            // Track associated weather
            if (day.weather) {
              item.weatherTypes[day.weather] =
                (item.weatherTypes[day.weather] || 0) + 1;
            }
          });
        }
      } else if (selectedFilter === "Weather") {
        // Process weather data
        if (day.weather) {
          const weatherName = day.weather;
          if (!dataMap.has(weatherName)) {
            dataMap.set(weatherName, {
              count: 0,
              moodSum: 0,
              days: [],
              activityTypes: {},
            });
          }
          const item = dataMap.get(weatherName);
          item.count++;
          item.moodSum += avgDayMood;
          item.days.push(day);

          // Track associated activities
          if (day.activities && day.activities.length > 0) {
            day.activities.forEach((activity) => {
              item.activityTypes[activity] =
                (item.activityTypes[activity] || 0) + 1;
            });
          } else {
            item.activityTypes["No Activity"] =
              (item.activityTypes["No Activity"] || 0) + 1;
          }
        }
      }
    });

    // Convert map to pie chart data array
    const result = [];

    if (selectedFilter === "Activity") {
      // Add "No Activity" first if it has entries
      const noActivity = dataMap.get("No Activity");
      if (noActivity && noActivity.count > 0) {
        const avgMood =
          noActivity.count > 0 ? noActivity.moodSum / noActivity.count : 0;

        // Find most common weather for No Activity
        let topWeather = null;
        let topWeatherCount = 0;
        Object.entries(noActivity.weatherTypes || {}).forEach(
          ([weatherName, count]) => {
            if (count > topWeatherCount) {
              topWeatherCount = count;
              topWeather = weatherName;
            }
          }
        );

        // Find weather emoji if available
        let weatherEmoji = "❓";
        if (topWeather) {
          const weatherItem = weather.find((w) => w.label === topWeather);
          if (weatherItem) weatherEmoji = weatherItem.icon;
        }

        result.push({
          value: noActivity.count,
          color: getMoodColor(avgMood),
          text: noActivity.count.toString(),
          emoji: "❌",
          moodEmoji: getMoodEmoji(avgMood),
          weatherEmoji: weatherEmoji,
          name: "No Activity",
          avgMood,
          days: noActivity.days,
          type: "Activity",
          weatherTypes: noActivity.weatherTypes || {},
        });
      }

      // Add all activities
      activities.forEach((activity) => {
        if (dataMap.has(activity.label)) {
          const data = dataMap.get(activity.label);
          const avgMood = data.count > 0 ? data.moodSum / data.count : 0;

          // Find most common weather
          let topWeather = null;
          let topWeatherCount = 0;
          Object.entries(data.weatherTypes || {}).forEach(
            ([weatherName, count]) => {
              if (count > topWeatherCount) {
                topWeatherCount = count;
                topWeather = weatherName;
              }
            }
          );

          // Find weather emoji if available
          let weatherEmoji = "❓";
          if (topWeather) {
            const weatherItem = weather.find((w) => w.label === topWeather);
            if (weatherItem) weatherEmoji = weatherItem.icon;
          }

          result.push({
            value: data.count,
            color: getMoodColor(avgMood),
            text: data.count.toString(),
            emoji: activity.icon,
            moodEmoji: getMoodEmoji(avgMood),
            weatherEmoji: weatherEmoji,
            name: activity.label,
            avgMood,
            days: data.days,
            type: "Activity",
            weatherTypes: data.weatherTypes || {},
          });
        }
      });
    } else if (selectedFilter === "Weather") {
      // Add all weather types
      weather.forEach((weatherType) => {
        if (dataMap.has(weatherType.label)) {
          const data = dataMap.get(weatherType.label);
          const avgMood = data.count > 0 ? data.moodSum / data.count : 0;

          // Find most common activity
          let topActivity = null;
          let topActivityCount = 0;
          Object.entries(data.activityTypes || {}).forEach(
            ([activityName, count]) => {
              if (count > topActivityCount) {
                topActivityCount = count;
                topActivity = activityName;
              }
            }
          );

          // Find activity emoji if available
          let activityEmoji = "❓";
          if (topActivity === "No Activity") {
            activityEmoji = "❌";
          } else if (topActivity) {
            const activityItem = activities.find(
              (a) => a.label === topActivity
            );
            if (activityItem) activityEmoji = activityItem.icon;
          }

          result.push({
            value: data.count,
            color: getMoodColor(avgMood),
            text: data.count.toString(),
            emoji: weatherType.icon,
            moodEmoji: getMoodEmoji(avgMood),
            activityEmoji: activityEmoji,
            name: weatherType.label,
            avgMood,
            days: data.days,
            type: "Weather",
            activityTypes: data.activityTypes || {},
          });
        }
      });
    }

    return result;
  }, [selectedFilter]);

  // Calculate total logs for percentage display
  const totalLogs = useMemo(() => {
    return pieData.reduce((sum, item) => sum + item.value, 0);
  }, [pieData]);

  // Handle slice press
  const handleSlicePress = (item) => {
    const categoryData = {
      type: item.type,
      name: item.name,
      value: item.avgMood,
      count: item.value,
      days: item.days,
      isCountData: true,
      emoji: item.emoji,
      // Add cross-relationship data
      ...(item.type === "Activity"
        ? { weatherTypes: item.weatherTypes }
        : { activityTypes: item.activityTypes }),
    };

    setSelectedCategory(categoryData);
    setModalVisible(true);
  };

  // Render a custom item to show relationships
  const renderLegendItem = (item, index) => {
    return (
      <View key={index} style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
        <Text style={styles.legendEmoji}>{item.emoji}</Text>
        <View style={styles.relationshipContainer}>
          <Text style={styles.legendMoodEmoji}>{item.moodEmoji}</Text>
          {item.type === "Activity" ? (
            <Text style={styles.legendWeatherEmoji}>{item.weatherEmoji}</Text>
          ) : (
            <Text style={styles.legendActivityEmoji}>{item.activityEmoji}</Text>
          )}
        </View>
        <Text style={styles.legendText}>
          {item.name} ({Math.round((item.value / totalLogs) * 100)}%)
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            donut
            radius={chartSize / 2}
            innerRadius={chartSize / 4}
            innerCircleColor={"#fff"}
            centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.centerLabelText}>{totalLogs}</Text>
                <Text style={styles.centerLabelSubtext}>Total Logs</Text>
              </View>
            )}
            onPress={handleSlicePress}
            strokeWidth={0}
            focusOnPress
            labelPosition={"onBorder"}
            showValuesAsLabels={false}
            showGradient={false}
          />
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </View>

      {/* Legend with relationship indicators */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>
          {selectedFilter === "Activity"
            ? "🎯 Activity | 😊 Mood | ☁️ Weather"
            : "☁️ Weather | 😊 Mood | 🎯 Activity"}
        </Text>
        {pieData.map(renderLegendItem)}
      </View>

      {/* Legend explanation */}
      <View style={styles.legendExplanation}>
        <Text style={styles.explanationText}>
          Tap on a slice to see detailed relationship data
        </Text>
      </View>

      {/* Detail Modal */}
      <CategoryDetailModal
        visible={modalVisible}
        data={selectedCategory}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 10,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabelText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  centerLabelSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  legendTitle: {
    width: "100%",
    textAlign: "center",
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 8,
    width: "45%",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  relationshipContainer: {
    flexDirection: "row",
    marginRight: 4,
  },
  legendMoodEmoji: {
    fontSize: 12,
    marginRight: 1,
  },
  legendWeatherEmoji: {
    fontSize: 12,
  },
  legendActivityEmoji: {
    fontSize: 12,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
    flex: 1,
  },
  noDataText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginVertical: 50,
  },
  legendExplanation: {
    marginTop: 5,
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 12,
    fontStyle: "italic",
    color: colors.text.secondary,
  },
});

export default ActivityWeatherPieChart;
