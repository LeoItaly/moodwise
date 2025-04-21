import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors } from "../constants";
import { activities, weather } from "../data/appData";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { moodColors, getMoodEmoji } from "../utils/moodUtils";

const CategoryDetailModal = ({ visible, data, onClose }) => {
  if (!data) return null;

  // Format date from ISO string to simple display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get color based on mood value
  const getMoodColor = (moodValue) => {
    if (moodValue < 1) return colors.mood.awful;
    if (moodValue < 2) return colors.mood.bad;
    if (moodValue < 3) return colors.mood.neutral;
    if (moodValue < 4) return colors.mood.good;
    return colors.mood.great;
  };

  // Calculate related data insights
  const insights = useMemo(() => {
    // No days data available
    if (!data.days || data.days.length === 0) {
      return { relatedCategories: [], moodDistribution: {} };
    }

    // Count related categories (activities for weather and vice versa)
    const categoryCounts = {};
    const weatherCounts = {};
    const moodDistribution = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

    // Process each day to find cross-relationships
    data.days.forEach((day) => {
      // Count mood occurrences
      const avgMood = Math.round((day.moods[0] + day.moods[1]) / 2);
      if (moodDistribution[avgMood] !== undefined) {
        moodDistribution[avgMood]++;
      }

      // Count activities
      if (day.activities && day.activities.length > 0) {
        day.activities.forEach((activityName) => {
          categoryCounts[activityName] =
            (categoryCounts[activityName] || 0) + 1;
        });
      } else if (data.type === "Weather") {
        // Count "No Activity" for weather categories
        categoryCounts["No Activity"] =
          (categoryCounts["No Activity"] || 0) + 1;
      }

      // Count weather
      if (day.weather) {
        weatherCounts[day.weather] = (weatherCounts[day.weather] || 0) + 1;
      }
    });

    // Sort and format related categories
    let relatedCategories = [];
    if (data.type === "Activity") {
      // For activities, show related weather
      relatedCategories = Object.entries(weatherCounts)
        .map(([name, count]) => {
          const weatherItem = weather.find((w) => w.label === name);
          return {
            name,
            count,
            percentage: Math.round((count / data.days.length) * 100),
            icon: weatherItem ? weatherItem.icon : "❓",
          };
        })
        .sort((a, b) => b.count - a.count);
    } else {
      // For weather, show related activities
      relatedCategories = Object.entries(categoryCounts)
        .map(([name, count]) => {
          let icon = "❓";
          if (name === "No Activity") {
            icon = "❌";
          } else {
            const activityItem = activities.find((a) => a.label === name);
            if (activityItem) icon = activityItem.icon;
          }

          return {
            name,
            count,
            percentage: Math.round((count / data.days.length) * 100),
            icon,
          };
        })
        .sort((a, b) => b.count - a.count);
    }

    return {
      relatedCategories,
      moodDistribution,
    };
  }, [data]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header with emoji and name */}
          <View style={styles.header}>
            <Text style={styles.emoji}>{data.emoji}</Text>
            <Text style={styles.title}>{data.name}</Text>
          </View>

          {/* Summary section */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Logs</Text>
              <Text style={styles.summaryValue}>{data.count}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Average Mood</Text>
              <View style={styles.moodContainer}>
                <Text style={styles.summaryValue}>
                  {data.value ? data.value.toFixed(1) : "0"}
                </Text>
                <Text style={styles.moodEmoji}>{getMoodEmoji(data.value)}</Text>
              </View>
            </View>
          </View>

          <ScrollView style={styles.scrollContainer}>
            {/* Mood Distribution */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Mood Distribution</Text>
              <View style={styles.moodDistribution}>
                {Object.entries(insights.moodDistribution).map(
                  ([mood, count]) => {
                    if (count === 0) return null;
                    const percentage = Math.round(
                      (count / data.days.length) * 100
                    );
                    return (
                      <View key={mood} style={styles.moodItem}>
                        <Text style={styles.moodEmoji}>
                          {getMoodEmoji(Number(mood))}
                        </Text>
                        <View
                          style={[
                            styles.moodBar,
                            {
                              width: `${Math.max(percentage, 5)}%`,
                              backgroundColor: getMoodColor(Number(mood)),
                            },
                          ]}
                        />
                        <Text style={styles.moodPercentage}>{percentage}%</Text>
                      </View>
                    );
                  }
                )}
              </View>
            </View>

            {/* Related categories section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                {data.type === "Activity"
                  ? "Related Weather"
                  : "Related Activities"}
              </Text>
              {insights.relatedCategories.length > 0 ? (
                <View style={styles.relatedList}>
                  {insights.relatedCategories.map((item, index) => (
                    <View key={index} style={styles.relatedItem}>
                      <View style={styles.relatedItemHeader}>
                        <Text style={styles.relatedItemEmoji}>{item.icon}</Text>
                        <Text style={styles.relatedItemName}>{item.name}</Text>
                        <Text style={styles.relatedItemPercentage}>
                          {item.percentage}%
                        </Text>
                      </View>
                      <View style={styles.percentageBar}>
                        <View
                          style={[
                            styles.percentageFill,
                            { width: `${item.percentage}%` },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noDataText}>No related data available</Text>
              )}
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Days list */}
            <Text style={styles.sectionTitle}>Recorded Days</Text>
            <View style={styles.daysList}>
              {data.days && data.days.length > 0 ? (
                data.days.map((day, index) => {
                  const avgMood = (day.moods[0] + day.moods[1]) / 2;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.dayItem,
                        { borderLeftColor: getMoodColor(avgMood) },
                      ]}
                    >
                      <View style={styles.dayHeader}>
                        <Text style={styles.dayDate}>
                          {formatDate(day.date)}
                        </Text>
                        <Text style={styles.dayMood}>
                          {avgMood.toFixed(1)} {getMoodEmoji(avgMood)}
                        </Text>
                      </View>
                      <View style={styles.dayDetails}>
                        {day.activities && day.activities.length > 0 ? (
                          <Text style={styles.dayActivities}>
                            🏃 {day.activities.join(", ")}
                          </Text>
                        ) : (
                          <Text style={styles.dayActivities}>
                            🚫 No activities
                          </Text>
                        )}
                        {day.weather && (
                          <Text style={styles.dayWeather}>
                            ☁️ {day.weather}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noDaysText}>No days recorded</Text>
              )}
            </View>
          </ScrollView>

          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  emoji: {
    fontSize: 28,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.primary,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  moodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 20,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 15,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 10,
  },
  daysList: {
    marginBottom: 15,
  },
  dayItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    marginBottom: 8,
    backgroundColor: colors.background.light,
    borderRadius: 6,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dayDate: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
  },
  dayMood: {
    fontSize: 14,
    color: colors.text.primary,
  },
  dayDetails: {
    marginTop: 4,
  },
  dayActivities: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  dayWeather: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  noDaysText: {
    textAlign: "center",
    color: colors.text.secondary,
    fontStyle: "italic",
    paddingVertical: 20,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    color: colors.text.secondary,
    fontStyle: "italic",
    paddingVertical: 10,
  },
  relatedList: {
    marginTop: 5,
  },
  relatedItem: {
    marginBottom: 10,
  },
  relatedItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  relatedItemEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  relatedItemName: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  relatedItemPercentage: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  percentageBar: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  percentageFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  moodDistribution: {
    marginTop: 5,
  },
  moodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  moodBar: {
    height: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  moodPercentage: {
    fontSize: 12,
    color: colors.text.secondary,
    width: 30,
  },
});

export default CategoryDetailModal;
