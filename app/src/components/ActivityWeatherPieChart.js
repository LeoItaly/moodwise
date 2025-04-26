import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { sampleData, activities, weather } from "../data/appData";
import { colors } from "../constants";
import CategoryDetailModal from "./CategoryDetailModal";
import { getMoodColor, getMoodEmoji } from "../utils/moodUtils";

const ActivityWeatherPieChart = ({
  initialFilter = "Activity",
  onSlicePress,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get screen dimensions for responsive sizing
  const screenWidth = Dimensions.get("window").width;

  // Toggle between Activity and Weather filters
  const toggleFilter = () => {
    setSelectedFilter((prevFilter) =>
      prevFilter === "Activity" ? "Weather" : "Activity"
    );
  };

  // Process data for relationship analysis
  const relationshipData = useMemo(() => {
    // Map of all activities/weather entries with counts and mood sums
    const dataMap = new Map();

    // Initialize with "No Activity" category if we're in Activity mode
    if (selectedFilter === "Activity") {
      dataMap.set("No Activity", {
        count: 0,
        moodSum: 0,
        days: [],
        weatherTypes: {},
      });
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

          // Track associated weather
          if (day.weather) {
            item.weatherTypes[day.weather] =
              (item.weatherTypes[day.weather] || 0) + 1;
          }
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

    // Format data for display
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
          emoji: "❌",
          moodEmoji: getMoodEmoji(avgMood),
          weatherEmoji: weatherEmoji,
          name: "No Activity",
          avgMood,
          days: noActivity.days,
          type: "Activity",
          weatherTypes: noActivity.weatherTypes || {},
          topWeather: topWeather,
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
            emoji: activity.icon,
            moodEmoji: getMoodEmoji(avgMood),
            weatherEmoji: weatherEmoji,
            name: activity.label,
            avgMood,
            days: data.days,
            type: "Activity",
            weatherTypes: data.weatherTypes || {},
            topWeather: topWeather,
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
            emoji: weatherType.icon,
            moodEmoji: getMoodEmoji(avgMood),
            activityEmoji: activityEmoji,
            name: weatherType.label,
            avgMood,
            days: data.days,
            type: "Weather",
            activityTypes: data.activityTypes || {},
            topActivity: topActivity,
          });
        }
      });
    }

    // Sort by average mood (highest to lowest)
    return result.sort((a, b) => b.avgMood - a.avgMood);
  }, [selectedFilter]);

  // Handle category selection
  const handleCategoryPress = (item) => {
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

    if (onSlicePress) {
      onSlicePress(categoryData);
    } else {
      setSelectedCategory(categoryData);
      setModalVisible(true);
    }
  };

  const totalLogs = relationshipData.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.container}>
      {/* Filter toggle */}
      <View style={styles.filterBadgeContainer}>
        <TouchableOpacity
          style={styles.filterBadge}
          onPress={toggleFilter}
          activeOpacity={0.7}
        >
          <Text style={styles.filterBadgeText}>
            {selectedFilter === "Activity"
              ? "🏃‍♂️ Activity Data"
              : "☁️ Weather Data"}
          </Text>
          <Text style={styles.filterToggleHint}>(Tap to switch)</Text>
        </TouchableOpacity>
      </View>

      {/* Summary cards */}
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>
          {selectedFilter === "Activity"
            ? "Activity & Weather Relationships"
            : "Weather & Activity Relationships"}
        </Text>
        <Text style={styles.summarySubtitle}>
          Sorted by mood: happiest to lowest
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer}
      >
        {relationshipData.length > 0 ? (
          relationshipData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.relationshipCard, { borderLeftColor: item.color }]}
              onPress={() => handleCategoryPress(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.moodIndicator}>
                  <Text style={styles.moodScore}>
                    {item.avgMood.toFixed(1)}
                  </Text>
                  <Text style={styles.moodEmoji}>{item.moodEmoji}</Text>
                </View>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Frequency:</Text>
                  <View style={styles.detailValue}>
                    <Text>{item.value} logs</Text>
                    <Text style={styles.percentageSmall}>
                      ({Math.round((item.value / totalLogs) * 100)}%)
                    </Text>
                  </View>
                </View>

                {item.type === "Activity" ? (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Common Weather:</Text>
                    <View style={styles.detailValue}>
                      <Text>{item.topWeather || "N/A"}</Text>
                      <Text style={styles.detailEmoji}>
                        {item.weatherEmoji}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Common Activity:</Text>
                    <View style={styles.detailValue}>
                      <Text>{item.topActivity || "N/A"}</Text>
                      <Text style={styles.detailEmoji}>
                        {item.activityEmoji}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.percentageBar}>
                  <View
                    style={[
                      styles.percentageFill,
                      {
                        width: `${Math.min(
                          100,
                          Math.round((item.avgMood / 4) * 100)
                        )}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                  <Text style={styles.percentageText}>
                    Mood: {Math.round((item.avgMood / 4) * 100)}%
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </ScrollView>

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
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  scrollView: {
    width: "100%",
    marginBottom: 10,
  },
  cardsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  noDataText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginVertical: 30,
    textAlign: "center",
  },
  filterBadgeContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  filterBadge: {
    backgroundColor: colors.background.secondary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
    flexDirection: "column",
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  filterToggleHint: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: 2,
    fontStyle: "italic",
  },
  summaryHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: "italic",
  },
  relationshipCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    borderLeftWidth: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    flex: 1,
  },
  moodIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  moodScore: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  moodEmoji: {
    fontSize: 16,
  },
  cardCount: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  cardDetails: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailEmoji: {
    fontSize: 16,
    marginLeft: 5,
  },
  percentageSmall: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  percentageBar: {
    height: 18,
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
    position: "relative",
  },
  percentageFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
  },
  percentageText: {
    position: "absolute",
    right: 8,
    top: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.primary,
  },
});

export default ActivityWeatherPieChart;
